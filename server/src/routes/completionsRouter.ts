import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AuthRequest } from '../types/authTypes';

import { authenticateToken } from '../middleware/authMiddleware';
import User from '../models/userModel';
import Quest from '../models/questModel';
import Completion from '../models/completionModel';

import { completionsService } from '../services/completionsService';

const router = express.Router();

// GET /api/completions
// Retrieve all completions given certain query parameter options sorted by recency
// ?completedQuest to filter by quest id
// ?completer to filter by user id of the user that completed the quest
// ?skip number of entries to skip over
// ?limit number of entries to limit the request to
router.get("", async (req: Request, res: Response) => {

})

// POST /api/completions
// Create a new completion for a quest given a message, checkListIndex and completedQuest quest id
router.post("", authenticateToken, async (req: AuthRequest, res: Response) => {
    let { checkListIndex, comment, completedQuest } = req.body;

    try {
        if (!req.user) return res.status(401).json({ success: false, data: "Unauthorized" });

        const user = await User.findOne({_id: req.user.id});
        if (!user) {
            return res.status(401).json({ success: false, data: "Unauthorized" });
        }

        if (checkListIndex == null 
            || checkListIndex == undefined 
            || completedQuest == null 
            || completedQuest == undefined
            || comment == null
            || comment == undefined
        ) {
            return res.status(400).json({ success: false, data: "checkListIndex, comment and completedQuest are required" });
        }
        if (
            typeof checkListIndex !== 'number' || 
            typeof comment !== 'string' || 
            typeof completedQuest !== 'string'
        ) {
            return res.status(400).json({ 
                success: false, 
                data: "checkListIndex must be a number, comment and completedQuest must be strings" 
            });
        }

        const logCompletionResult = await completionsService.logNewCompletion(completedQuest, user.id, checkListIndex, comment);
        if (!logCompletionResult?.success) {
            return res.status(400).json({ 
                success: false, 
                data: logCompletionResult?.data as string 
            });
        }

        return res.status(200).json({
            success: true,
            data: "Completion successfully logged"
        });

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
})

export default router;