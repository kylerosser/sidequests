"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleapis_1 = require("googleapis");
const userModel_1 = __importDefault(require("../models/userModel"));
const emailVerificationService_1 = require("../services/emailVerificationService");
const passwordResetService_1 = require("../services/passwordResetService");
const passwordUtils_1 = require("../utils/passwordUtils");
const usernameUtils_1 = require("../utils/usernameUtils");
const authMiddleware_1 = require("../middleware/authMiddleware");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "7d";
const JWT_COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000;
const USE_SECURE_JWT_COOKIE = process.env.NODE_ENV == "production"; // note: in prod, change to true for https
const JWT_COOKIE_SAMESITE = "strict";
const router = express_1.default.Router();
if (JWT_SECRET == undefined) {
    throw new Error("JSON web token secret not provided");
}
// POST api/auth/login/email
// Login and retrieve JSON web token using identifier (email or username) and password
router.post("/login/email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // NOTE: users can login with either username or password
    // such value is the identifier parameter
    let { identifier, password } = req.body;
    try {
        // Ensure all fields are present
        if (!identifier || !password) {
            return res.status(400).json({ success: false, data: "Email/username and password are required" });
        }
        // Remove leading and trailing whitespace from identifier
        identifier = identifier.trim();
        // If the identifier looks like an email, enforce lowercase
        const isEmail = identifier.includes("@");
        identifier = isEmail ? identifier.toLowerCase() : identifier;
        // Search for users that match the email/username
        const existingUser = yield userModel_1.default.findOne(isEmail
            ? { email: identifier }
            : { username: { $regex: `^${identifier}$`, $options: "i" } });
        // Handle nonexistent identifier
        if (!existingUser) {
            return res.status(401).json({ success: false, data: "No account found with that username/email" });
        }
        // Handle no password hash (user signed in previously with google)
        if (!existingUser.passwordHash) {
            return res.status(401).json({ success: false, data: "This account was not set up with a password. Please Sign In with Google instead." });
        }
        // Handle incorrect password
        const isPasswordCorrect = yield (0, passwordUtils_1.comparePasswordToHash)(password, existingUser.passwordHash);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, data: "Incorrect password" });
        }
        // If the user is unverified, resend verification email if expired and reject login
        if (!existingUser.isEmailVerified) {
            yield emailVerificationService_1.emailVerificationService.sendVerificationEmailIfExpired(existingUser._id, existingUser.email);
            return res.status(401).json({ success: false, data: "Please click the link sent to your email to activate your account." });
        }
        // Generate a JSON web token
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
}));
// POST api/auth/login/google
// Login and retrieve JSON web token using google authorization code
router.post("/login/google", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { code } = req.body;
    try {
        // Ensure all fields are present
        if (!code) {
            return res.status(400).json({ success: false, data: "Code is required" });
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.NODE_ENV == "production" ? "https://sidequests.nz/google-callback" : "http://localhost:5173/google-callback");
        let { tokens } = yield oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = googleapis_1.google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });
        const googleResponse = yield oauth2.userinfo.get();
        if (!googleResponse.data)
            return res.status(400).json({ success: false, data: "Failed to authenticate with google" });
        const googleId = googleResponse.data.id;
        const googleEmail = googleResponse.data.email;
        const isGoogleEmailVerified = googleResponse.data.verified_email;
        if (!googleId || !googleEmail)
            return res.status(400).json({ success: false, data: "Failed to authenticate with google" });
        const existingUser = yield userModel_1.default.findOne({ googleId });
        if (existingUser) {
            // A user with this googleId exists, log them in
            // Generate a JSON web token
            const token = jsonwebtoken_1.default.sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
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
        }
        else {
            // No user with this googleId exists, either:
            // - Find a pre-existing user with the same email address, link the user with this google account, and log them in
            // - Create a new user if no user with this email exists, link the user with this google account, and log them in
            // Ensure that we only proceed if the google account email is verified, for security reasons
            if (!isGoogleEmailVerified)
                return res.status(400).json({ success: false, data: "Google account primary email is not verified" });
            const existingEmailUser = yield userModel_1.default.findOne({ email: googleEmail });
            if (existingEmailUser) {
                // We found a pre-existing user with this email address
                // Link the google account and log them in
                existingEmailUser.googleId = googleId;
                existingEmailUser.save();
                // Generate a JSON web token
                const token = jsonwebtoken_1.default.sign({ id: existingEmailUser.id, email: existingEmailUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
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
            }
            else {
                // Create a new account with this google email and a generated username and log them in
                const generatedUsername = yield (0, usernameUtils_1.generateUsernameFromEmail)(googleEmail);
                if (!generatedUsername) {
                    return res.status(500).json({ success: false, data: "Failed to generate username" });
                }
                const newUser = new userModel_1.default({
                    username: generatedUsername,
                    email: googleEmail,
                    googleId,
                    isEmailVerified: true
                });
                yield newUser.save();
                // Generate a JSON web token
                const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
}));
// POST api/auth/logout
// Log out and clear JSON web token
router.post("/logout", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, data: "Unauthorized" });
        res.clearCookie("token", {
            httpOnly: true,
            secure: USE_SECURE_JWT_COOKIE,
            sameSite: JWT_COOKIE_SAMESITE
        });
        return res.status(200).json({
            success: true,
            data: "Logged out successfuly"
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
}));
// POST api/auth/signup/email
// Signup and create a new account using email and password
router.post("/signup/email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, email, password } = req.body;
    try {
        // Ensure all fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, data: "Username, email, and password are required" });
        }
        // Remove leading and trailing whitespace from username and email
        // and force email to be lowercase (emails are always stored as lowercase)
        username = username === null || username === void 0 ? void 0 : username.trim();
        email = email === null || email === void 0 ? void 0 : email.trim().toLowerCase();
        // Ensure username is alphanumeric (but allowing underscores)
        const usernameAlnumRegex = new RegExp(`^[a-zA-Z0-9_]+$`);
        if (!usernameAlnumRegex.test(username)) {
            return res.status(400).json({ success: false, data: "Your username can only contain numbers, letters and underscores" });
        }
        // Validate username
        const validateUsernameResult = yield (0, usernameUtils_1.validateUsername)(username);
        if (!validateUsernameResult.success) {
            return res.status(400).json({ success: false, data: validateUsernameResult.data });
        }
        // Ensure email is unique
        const existingEmail = yield userModel_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, data: "This email is already in use" });
        }
        // Ensure email is of a reasonable format
        const emailValidityRegex = new RegExp(`.+@.+`);
        if (!emailValidityRegex.test(email)) {
            return res.status(400).json({ success: false, data: "Please enter a valid email address" });
        }
        // Validate password
        const validatePasswordResult = (0, passwordUtils_1.validatePassword)(password);
        if (!validatePasswordResult.success) {
            return res.status(400).json({ success: false, data: validatePasswordResult.data });
        }
        // Hash the password for storage
        const passwordHash = yield (0, passwordUtils_1.hashPassword)(password);
        // Create a new User in the database
        const newUser = new userModel_1.default({
            username,
            email,
            passwordHash,
        });
        yield newUser.save();
        yield emailVerificationService_1.emailVerificationService.sendVerificationEmail(newUser._id, email);
        return res.status(201).json({
            success: true,
            data: "Account created successfully",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
}));
// POST api/auth/verify
// Verify the account associated with an EmailVerification token
router.post("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { token } = req.body;
    try {
        // Ensure all fields are present
        if (!token) {
            return res.status(400).json({ success: false, data: "Token is required" });
        }
        if (typeof token !== 'string') {
            return res.status(400).json({ success: false, data: "Token must be a string" });
        }
        const verificationSuccess = yield emailVerificationService_1.emailVerificationService.verifyUserWithToken(token);
        if (verificationSuccess) {
            return res.status(200).json({
                success: true,
                data: "Account verified successfully",
            });
        }
        else {
            return res.status(400).json({
                success: false,
                data: "Invalid token",
            });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
}));
// POST api/auth/reset-password
// Reset an user's password given a password and a valid token
router.post("/reset-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { token, newPassword } = req.body;
    try {
        // Ensure all fields are present
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, data: "Token and new password are required" });
        }
        if (typeof token !== 'string') {
            return res.status(400).json({ success: false, data: "Token must be a string" });
        }
        // Check that the new password is valid
        const validatePasswordResult = (0, passwordUtils_1.validatePassword)(newPassword);
        if (!validatePasswordResult.success) {
            return res.status(400).json({ success: false, data: validatePasswordResult.data });
        }
        // Attempt to reset password using the provided token 
        const resetSuccess = yield passwordResetService_1.passwordResetService.resetPasswordWithToken(token, newPassword);
        if (!resetSuccess) {
            return res.status(400).json({ success: false, data: "This password reset link has expired" });
        }
        return res.status(200).json({ success: true, data: "Password reset successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
}));
// POST api/auth/forgot-password
// Send a password reset email given a valid email address
router.post("/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = req.body;
    try {
        // Ensure all fields are present
        if (!email) {
            return res.status(400).json({ success: false, data: "Email is required" });
        }
        if (typeof email !== 'string') {
            return res.status(400).json({ success: false, data: "Email must be a string" });
        }
        email = email === null || email === void 0 ? void 0 : email.trim().toLowerCase();
        const foundUser = yield userModel_1.default.findOne({ email: email });
        if (!foundUser) {
            return res.status(400).json({ success: false, data: "We couldn't find an account with this email" });
        }
        const isEligibleForReset = yield passwordResetService_1.passwordResetService.checkUserEligibleForReset(foundUser._id);
        if (!isEligibleForReset)
            return res.status(400).json({ success: false, data: "You must wait before requesting another password reset. Please try again later." });
        yield passwordResetService_1.passwordResetService.sendResetEmail(foundUser._id, email);
        return res.status(200).json({ success: true, data: "Password reset email sent" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
}));
exports.default = router;
