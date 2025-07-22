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
const questsService_1 = require("../services/questsService");
const routeUtils_1 = require("../utils/routeUtils");
const router = express_1.default.Router();
// GET api/quests
// Retrieve all quests (their id and title) within a particular bounding box (for display on map)
router.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure all fields are present
        try {
            const minLat = (0, routeUtils_1.parseNumber)(req.query.minLat);
            const minLng = (0, routeUtils_1.parseNumber)(req.query.minLng);
            const maxLat = (0, routeUtils_1.parseNumber)(req.query.maxLat);
            const maxLng = (0, routeUtils_1.parseNumber)(req.query.maxLng);
            const bounds = [[minLng, minLat], [maxLng, maxLat]];
            const foundQuests = yield questsService_1.questsService.getQuestsWithinBounds(bounds);
            const formattedQuests = foundQuests.map(quest => {
                const creator = quest.creator; // to satisfy typescript
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
        }
        catch (err) {
            return res.status(400).json({ success: false, data: "Malformed coordinates bounds" });
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
// GET api/quests/:id
// Retrieve a quest by id
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            return res.status(400).json({ success: false, data: "Id must be present" });
        const foundQuest = yield questsService_1.questsService.findQuestById(id);
        if (!foundQuest)
            return res.status(404).json({ success: false, data: "Quest not found" });
        const creator = foundQuest.creator; // to satisfy typescript
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: "An unexpected error occurred",
        });
    }
}));
exports.default = router;
