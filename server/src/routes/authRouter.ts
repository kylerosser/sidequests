import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { AuthRequest } from '../types/authTypes';

import User from '../models/userModel';

import { emailVerificationService } from '../services/emailVerificationService'

import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "7d";
const JWT_COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000;
const USE_SECURE_JWT_COOKIE = false; // note: in prod, change to true for https
const JWT_COOKIE_SAMESITE = "strict";
const SALT_ROUNDS = 10;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

if (JWT_SECRET == undefined) {
    throw new Error("JSON web token secret not provided");
}

// POST api/auth/login
// Login and retrieve JSON web token
router.post("/login/email", async (req: Request, res: Response) => {
    // NOTE: users can login with either username or password
    // such value is the identifier parameter
    let { identifier, password } = req.body;

    try {
        // Ensure all fields are present
        if (!identifier || !password) {
            return res.status(400).json({success: false, data: "Email/username and password are required"});
        }
        
        // Remove leading and trailing whitespace from identifier
        identifier = identifier.trim();

        // If the identifier looks like an email, enforce lowercase
        const isEmail = identifier.includes("@");
        identifier = isEmail ? identifier.toLowerCase() : identifier;

        // Search for users that match the email/username
        const existingUser = await User.findOne(
            isEmail
            ? { email: identifier }
            : { username: { $regex: `^${identifier}$`, $options: "i" } }
        );

        // Handle nonexistent identifier
        if (!existingUser) {
            return res.status(401).json({ success: false, data: "No account found with that username/email" });
        }

        // Handle incorrect password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash)
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, data: "Incorrect password" });
        }

        // If the user is unverified, resend verification email if expired and reject login
        if (!existingUser.isEmailVerified) {
            await emailVerificationService.sendVerificationEmailIfExpired(existingUser._id as Types.ObjectId, existingUser.email);
            return res.status(401).json({ success: false, data: "Please click the link sent to your email to activate your account." });
        }

        // Generate a JSON web token
        const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: USE_SECURE_JWT_COOKIE, 
            sameSite: JWT_COOKIE_SAMESITE,
            maxAge: JWT_COOKIE_EXPIRY
        });

        return res.status(200).json({
            success: true,
            data: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
            },
        });
        
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
});

// POST api/auth/logout
// Log out and clear JSON web token
router.post("/logout", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, data: "Unauthorized" });
        
        res.clearCookie("token", {
            httpOnly: true,
            secure: USE_SECURE_JWT_COOKIE,
            sameSite: JWT_COOKIE_SAMESITE
        });

        return res.status(200).json({
            success: true,
            data: "Logged out successfuly"
        });

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
});

// POST api/auth/signup/email
// Signup and create a new account using email and password
router.post("/signup/email", async (req: Request, res: Response) => {
    let { username, email, password } = req.body;

    try {
        // Ensure all fields are present
        if (!username || !email || !password) {
            return res.status(400).json({success: false, data: "Username, email, and password are required"});
        }

        // Remove leading and trailing whitespace from username and email
        // and force email to be lowercase (emails are always stored as lowercase)
        username = username?.trim();
        email = email?.trim().toLowerCase();

        // Ensure username is alphanumeric (but allowing underscores)
        const usernameAlnumRegex = new RegExp(`^[a-zA-Z0-9_]+$`);
        if (!usernameAlnumRegex.test(username)) {
            return res.status(400).json({success: false, data: "Your username can only contain numbers, letters and underscores"});
        }

        // Ensure username is of an acceptable length
        if (username.length < MIN_USERNAME_LENGTH) {
            return res.status(400).json({success: false, data: `Your username must be at least ${MIN_USERNAME_LENGTH} characters`});
        }
        if (username.length > MAX_USERNAME_LENGTH) {
            return res.status(400).json({success: false, data: `Your username cannot be greater than ${MAX_USERNAME_LENGTH} characters`});
        }
        
        // Ensure username is unique (case insensitive)
        const existingUsername = await User.findOne({
            username: { $regex: `^${username}$`, $options: 'i' } // ignore case
        }); 
        if (existingUsername) {
            return res.status(400).json({success: false, data: "This username is already in use"});
        }

        // Ensure email is unique
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({success: false, data: "This email is already in use"});
        }
        // Ensure email is of a reasonable format
        const emailValidityRegex = new RegExp(`.+@.+`);
        if (!emailValidityRegex.test(email)) {
            return res.status(400).json({success: false, data: "Please enter a valid email address"});
        }

        // Ensure password is of an acceptable length
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({success: false, data: `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long`});
        }
        if (password.length > MAX_PASSWORD_LENGTH) {
            return res.status(400).json({success: false, data: `Your password is too long. ${MAX_PASSWORD_LENGTH} character limit.`});
        }

        // Password must contain at least one letter and one number
        const passwordComplexityRegex = new RegExp(`^(?=.*[A-Za-z])(?=.*\\d).+$`);
        if (!passwordComplexityRegex.test(password)) {
            return res.status(400).json({success: false, data: "Your password must contain at least one letter and one number"});
        }

        // Hash the password for storage
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new User in the database
        const newUser = new User({
            username,
            email,
            passwordHash,
        });
        await newUser.save();

        await emailVerificationService.sendVerificationEmail(newUser._id as Types.ObjectId, email);

        return res.status(201).json({
            success: true,
            data: "Account created successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
});

// POST api/auth/verify
// Verify the account associated with an EmailVerification token
router.post("/verify", async (req: Request, res: Response) => {
    let { token } = req.body;

    try {
        // Ensure all fields are present
        if (!token) {
            return res.status(400).json({success: false, data: "Token is required"});
        }
        if (typeof token !== 'string') {
            return res.status(400).json({success: false, data: "Token must be a string"});
        }

        const verificationSuccess = await emailVerificationService.verifyUserWithToken(token);
        if (verificationSuccess) {
            return res.status(200).json({
                success: true,
                data: "Account verified successfully",
            });
        } else {
            return res.status(400).json({
                success: false,
                data: "Invalid token",
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
});

export default router;