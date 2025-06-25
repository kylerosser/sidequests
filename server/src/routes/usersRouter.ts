import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/authTypes';

import User from '../models/userModel';

import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// GET api/users/me
// Retrieve private user profile linked to an authenticated user
router.get("/me", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
        const existingUser = await User.findOne({_id: req.user.id});

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "Account does not exist" });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
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

// GET api/users
// Accepts query parameters username or id
// Retrieve public user profile by user id or username
router.get("", async (req: Request, res: Response) => {
    const { id, username } = req.query;

    try {
        let existingUser;
        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id as string)) {
                return res.status(400).json({ success: false, message: "Invalid id" });
            }
            existingUser = await User.findById(id as string);
        } else if (username) {
            existingUser = await User.findOne({ username: username as string });  
        } else {
            return res.status(400).json({ success: false, message: "Query parameter 'id' or 'username' required" });
        }

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: existingUser.id,
                username: existingUser.username
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

export default router;