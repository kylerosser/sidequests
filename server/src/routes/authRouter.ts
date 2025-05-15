import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/userModel';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "7d";
const SALT_ROUNDS = 10;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;

if (JWT_SECRET == undefined) {
    throw new Error("JSON web token secret not provided");
}

router.post("/login", async (req: Request, res: Response) => {
    // NOTE: users can login with either username or password
    // such value is the identifier parameter
    let { identifier, password } = req.body;

    try {
        // Ensure all fields are present
        if (!identifier || !password) {
            return res.status(400).json({success: false, message: "Email and password are required"});
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
            return res.status(401).json({ success: false, message: "Account does not exist" });
        }

        // Handle incorrect password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash)
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        // Generate a JSON web token
        const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        return res.status(200).json({
            success: true,
            data: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                token: token,
            },
        });
        
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
});

router.post("/signup", async (req: Request, res: Response) => {
    let { username, email, password } = req.body;

    try {
        // Ensure all fields are present
        if (!username || !email || !password) {
            return res.status(400).json({success: false, message: "Username, email, and password are required"});
        }

        // Remove leading and trailing whitespace from username and email
        // and force email to be lowercase (emails are always stored as lowercase)
        username = username?.trim();
        email = email?.trim().toLowerCase();

        // Ensure username is alphanumeric (but allowing underscores)
        const usernameAlnumRegex = new RegExp(`^[a-zA-Z0-9_]+$`);
        if (!usernameAlnumRegex.test(username)) {
            return res.status(400).json({success: false, message: "Your username can only contain numbers, letters and underscores"});
        }

        // Ensure username is of an acceptable length
        if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
            return res.status(400).json({success: false, message: `Your username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`});
        }
        
        // Ensure username is unique (case insensitive)
        const existingUsername = await User.findOne({
            username: { $regex: `^${username}$`, $options: 'i' } // ignore case
        }); 
        if (existingUsername) {
            return res.status(400).json({success: false, message: "This username is already in use"});
        }

        // Ensure email is unique
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({success: false, message: "This email is already in use"});
        }

        // Ensure password is of an acceptable length
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({success: false, message: `Your password must be at least ${MIN_PASSWORD_LENGTH} character long`});
        }

        // For security, ensure passwords contain at least a letter and a number
        const passwordComplexityRegex = new RegExp(`^(?=.*[A-Za-z])(?=.*\\d).+$`);
        if (!passwordComplexityRegex.test(password)) {
            console.log(password);
            return res.status(400).json({success: false, message: "Your password must contain at least one letter and one number"});
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

        // Generate a JSON web token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        return res.status(201).json({
            success: true,
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                token,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
});

export default router;