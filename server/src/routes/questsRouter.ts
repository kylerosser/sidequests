import express, { Request, Response } from 'express';
import { Types } from 'mongoose';

import { questsService, BBox } from '../services/questsService'
import { parseNumber } from '../utils/routeUtils';

const router = express.Router();

// GET api/quests
// Retrieve all quests (their id and title) within a particular bounding box (for display on map)
router.get("", async (req: Request, res: Response) => {
    try {
        // Ensure all fields are present
        try {
            const minLat = parseNumber(req.query.minLat);
            const minLng = parseNumber(req.query.minLng);
            const maxLat = parseNumber(req.query.maxLat);
            const maxLng = parseNumber(req.query.maxLng);
            const bounds: BBox = [[minLng, minLat], [maxLng, maxLat]];
            
            const foundQuests = await questsService.getQuestsWithinBounds(bounds);

            const formattedQuests = foundQuests.map(quest => {
                const creator = quest.creator as unknown as { _id: Types.ObjectId; username: string }; // to satisfy typescript
                return {
                    id: quest.id,
                    title: quest.title,
                    location: quest.location
                };
            });
            return res.status(200).json({
                success: true,
                data: formattedQuests
            });
            
        } catch (err) {
            return res.status(400).json({ success: false, data: "Malformed coordinates bounds" });
        }
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
});

// GET api/quests/:id
// Retrieve a quest by id
router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({success: false, data: "Id must be present"});
        const foundQuest = await questsService.findQuestById(id);

        if (!foundQuest) return res.status(404).json({success: false, data: "Quest not found"});

        const creator = foundQuest.creator as unknown as { _id: Types.ObjectId; username: string }; // to satisfy typescript
        return res.status(200).json({
            success: true,
            data: {
                id: foundQuest.id,
                title: foundQuest.title,
                description: foundQuest.description,
                location: foundQuest.location,
                creator: {
                    id: creator._id,
                    username: creator.username
                },
                checkList: foundQuest.checkList,
                createdAt: foundQuest.createdAt
            }
        }); 
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
});

export default router;