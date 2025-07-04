import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';

import { AuthRequest } from '../types/authTypes';

import User from '../models/userModel';

import { emailVerificationService } from '../services/emailVerificationService'
import { passwordResetService } from '../services/passwordResetService'
import { validatePassword, hashPassword, comparePasswordToHash} from '../utils/passwordUtils'

import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "7d";
const JWT_COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000;
const USE_SECURE_JWT_COOKIE = false; // note: in prod, change to true for https
const JWT_COOKIE_SAMESITE = "strict";
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;

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
        const isPasswordCorrect = await comparePasswordToHash(password, existingUser.passwordHash)
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

        // Validate password
        const validatePasswordResult = validatePassword(password)
        if (!validatePasswordResult.success) {
            return res.status(400).json({success: false, data: validatePasswordResult.data});
        }

        // Hash the password for storage
        const passwordHash = hashPassword(password);

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

// POST api/auth/reset-password
// Reset an user's password given a password and a valid token
router.post("/reset-password", async (req: Request, res: Response) => {
    let { token, newPassword } = req.body;

    try {
        // Ensure all fields are present
        if (!token || !newPassword) {
            return res.status(400).json({success: false, data: "Token and new password are required"});
        }
        if (typeof token !== 'string') {
            return res.status(400).json({success: false, data: "Token must be a string"});
        }

        // Check that the new password is valid
        const validatePasswordResult = validatePassword(newPassword)
        if (!validatePasswordResult.success) {
            return res.status(400).json({success: false, data: validatePasswordResult.data});
        }

        // Attempt to reset password using the provided token 
        const resetSuccess = await passwordResetService.resetPasswordWithToken(token, newPassword)
        if (!resetSuccess) {
            return res.status(400).json({success: false, data: "This password reset link has expired"});
        }

        return res.status(200).json({success: true, data: "Password reset successfully"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
});

// POST api/auth/forgot-password
// Send a password reset email given a valid email address
router.post("/forgot-password", async (req: Request, res: Response) => {
    let { email } = req.body;

    try {
        // Ensure all fields are present
        if (!email) {
            return res.status(400).json({success: false, data: "Email is required"});
        }
        if (typeof email !== 'string') {
            return res.status(400).json({success: false, data: "Email must be a string"});
        }

        email = email?.trim().toLowerCase();

        const foundUser = await User.findOne({ email: email});
        if (!foundUser) {
            return res.status(400).json({success: false, data: "We couldn't find an account with this email"});
        }
        
        const isEligibleForReset = await passwordResetService.checkUserEligibleForReset(foundUser._id as Types.ObjectId);
        if (!isEligibleForReset) return res.status(400).json({success: false, data: "You must wait before requesting another password reset. Please try again later."});
        
        await passwordResetService.sendResetEmail(foundUser._id as Types.ObjectId, email);

        return res.status(200).json({success: true, data: "Password reset email sent"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
});

export default router;