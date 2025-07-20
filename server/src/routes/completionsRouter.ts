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
// ?cursor a completions id used as a cursor to start fetching from (for infinite scroll pagination)
// ?limit limit the number of completions found
router.get("", async (req: Request, res: Response) => {
    let {completedQuest, completer, cursor, limit} = req.query

    try {
        if (completedQuest !== undefined && typeof completedQuest !== 'string') return res.status(400).json({ success: false, data: "completedQuest must be a string" });
        if (completer !== undefined && typeof completedQuest !== 'string') return res.status(400).json({ success: false, data: "completer must be a string" });
        if (cursor !== undefined && typeof cursor !== 'string') return res.status(400).json({ success: false, data: "cursor must be a string" });
        if (limit !== undefined && isNaN(Number(limit))) return res.status(400).json({ success: false, data: "limit must be a number" });
        const limitNumber = (limit !== undefined) ? Number(limit) : undefined;
    
        const completions = await completionsService.findCompletions(
            completedQuest as string | undefined, 
            completer as string | undefined, 
            cursor as string | undefined, 
            limitNumber as number | undefined
        );

        const formattedCompletions = completions.map((completion) => {
            return {
                id: completion.id,
                comment: completion.comment,
                completer: completion.completer,
                completedQuest: completion.completedQuest,
                checkListIndex: completion.checkListIndex,
                createdAt: completion.createdAt
            }
        })

        return res.status(200).json({
            success: true,
            data: formattedCompletions
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }

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