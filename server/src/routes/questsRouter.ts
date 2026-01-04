import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from "zod"

import { questsService, BBox } from '../services/questsService'
import { parseNumber } from '../utils/routeUtils';
import { CreateQuestBodySchema } from '@shared/schemas/questSchemas'
import { authenticateToken } from 'src/middleware/authMiddleware';
import { AuthRequest } from 'src/types/authTypes';
import Quest from '../models/questModel';
import { coordsInNZ } from '@shared/utils/geo'

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

// POST api/quests/create
// Create a new quest
router.post("/create", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, data: "Unauthorized" });

        const parseResult = CreateQuestBodySchema.safeParse(req.body)
        if (!parseResult.success) {
            return res.status(400).json({success: false, data: parseResult.error.issues[0].message });
        }
        const body = parseResult.data

        if (!coordsInNZ(body.coordinates.lat, body.coordinates.lng)) {
            return res.status(400).json({success: false, data: "Quest location must be in New Zealand" });
        }

        const questCount = await questsService.getUnmoderatedQuestCountForUser(req.user.id)
        if (questCount > 3) {
            return res.status(429).json({success: false, data: "You already have 3 submissions in the moderation queue, which is the maximum. Please try again later." })
        }

        await Quest.create({
            title: body.title,
            description: body.description,
            location: {
                type: "Point",
                coordinates: [body.coordinates.lng, body.coordinates.lat] // [lng, lat] as per MongoDB GeoJSON spec
            },
            moderatorApproved: false,
            creator: req.user.id,
            checkList: body.checkList.map(({id, ...activity}) => activity)
        })

        return res.status(200).json({success: true, data: "Quest submitted for moderation"})

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
});

export default router;