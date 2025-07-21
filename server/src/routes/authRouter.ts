import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';

import { AuthRequest } from '../types/authTypes';

import User from '../models/userModel';

import { emailVerificationService } from '../services/emailVerificationService'
import { passwordResetService } from '../services/passwordResetService'
import { validatePassword, hashPassword, comparePasswordToHash} from '../utils/passwordUtils'
import { validateUsername, generateUsernameFromEmail} from '../utils/usernameUtils'

import { authenticateToken } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "7d";
const JWT_COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000;
const USE_SECURE_JWT_COOKIE = process.env.NODE_ENV == "production"; // note: in prod, change to true for https
const JWT_COOKIE_SAMESITE = "strict";

const router = express.Router();

if (JWT_SECRET == undefined) {
    throw new Error("JSON web token secret not provided");
}

// POST api/auth/login/email
// Login and retrieve JSON web token using identifier (email or username) and password
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

        // Handle no password hash (user signed in previously with google)
        if (!existingUser.passwordHash) {
            return res.status(401).json({ success: false, data: "This account was not set up with a password. Please Sign In with Google instead." });
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

// POST api/auth/login/google
// Login and retrieve JSON web token using google authorization code
router.post("/login/google", async (req: Request, res: Response) => {
    let { code } = req.body;

    try {
        // Ensure all fields are present
        if (!code) {
            return res.status(400).json({success: false, data: "Code is required"});
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.NODE_ENV == "production" ? "https://sidequests.nz/google-callback" : "http://localhost:5173/google-callback"
        );

        let { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });

        const googleResponse = await oauth2.userinfo.get();
        if (!googleResponse.data) return res.status(400).json({success: false, data: "Failed to authenticate with google"});
        
        const googleId = googleResponse.data.id as string;
        const googleEmail = googleResponse.data.email as string;
        const isGoogleEmailVerified = googleResponse.data.verified_email as boolean;
        if (!googleId || !googleEmail ) return res.status(400).json({success: false, data: "Failed to authenticate with google"});

        const existingUser = await User.findOne({ googleId });
        if (existingUser) {
            // A user with this googleId exists, log them in

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
        } else {
            // No user with this googleId exists, either:
            // - Find a pre-existing user with the same email address, link the user with this google account, and log them in
            // - Create a new user if no user with this email exists, link the user with this google account, and log them in

            // Ensure that we only proceed if the google account email is verified, for security reasons
            if (!isGoogleEmailVerified) return res.status(400).json({success: false, data: "Google account primary email is not verified"});
            
            const existingEmailUser = await User.findOne({ email: googleEmail });
            if (existingEmailUser) {
                // We found a pre-existing user with this email address
                // Link the google account and log them in
                existingEmailUser.googleId = googleId;
                existingEmailUser.save();

                // Generate a JSON web token
                const token = jwt.sign(
                    { id: existingEmailUser.id, email: existingEmailUser.email },
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
                        id: existingEmailUser.id,
                        username: existingEmailUser.username,
                        email: existingEmailUser.email,
                    },
                });
            } else {
                // Create a new account with this google email and a generated username and log them in
                const generatedUsername = await generateUsernameFromEmail(googleEmail)
                if (!generatedUsername) {
                    return res.status(500).json({success: false, data: "Failed to generate username"});
                }
                const newUser = new User({
                    username: generatedUsername,
                    email: googleEmail,
                    googleId,
                    isEmailVerified: true
                });
                await newUser.save();

                // Generate a JSON web token
                const token = jwt.sign(
                    { id: newUser.id, email: newUser.email },
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
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                    },
                });
            }
        }
        
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

        // Validate username
        const validateUsernameResult = await validateUsername(username)
        if (!validateUsernameResult.success) {
            return res.status(400).json({success: false, data: validateUsernameResult.data});
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
        const passwordHash = await hashPassword(password);

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