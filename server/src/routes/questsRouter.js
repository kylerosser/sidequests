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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questsService_1 = require("../services/questsService");
const routeUtils_1 = require("../utils/routeUtils");
const questSchemas_1 = require("@shared/schemas/questSchemas");
const authMiddleware_1 = require("../middleware/authMiddleware");
const questModel_1 = __importDefault(require("../models/questModel"));
const geo_1 = require("@shared/utils/geo");
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
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    try {
        if (!q || typeof q !== 'string')
            return res.status(400).json({ success: false, data: "Query must be present" });
        const searchResults = yield questsService_1.questsService.getSearchResultsForQuery(q);
        return res.status(200).json({ success: true, data: searchResults });
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
// POST api/quests/create
// Create a new quest
router.post("/create", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, data: "Unauthorized" });
        const parseResult = questSchemas_1.CreateQuestBodySchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ success: false, data: parseResult.error.issues[0].message });
        }
        const body = parseResult.data;
        if (!(0, geo_1.coordsInNZ)(body.coordinates.lat, body.coordinates.lng)) {
            return res.status(400).json({ success: false, data: "Quest location must be in New Zealand" });
        }
        const questCount = yield questsService_1.questsService.getUnmoderatedQuestCountForUser(req.user.id);
        if (questCount > 3) {
            return res.status(429).json({ success: false, data: "You already have 3 submissions in the moderation queue, which is the maximum. Please try again later." });
        }
        yield questModel_1.default.create({
            title: body.title,
            description: body.description,
            location: {
                type: "Point",
                coordinates: [body.coordinates.lng, body.coordinates.lat] // [lng, lat] as per MongoDB GeoJSON spec
            },
            moderatorApproved: false,
            creator: req.user.id,
            checkList: body.checkList.map((_a) => {
                var { id } = _a, activity = __rest(_a, ["id"]);
                return activity;
            })
        });
        return res.status(200).json({ success: true, data: "Quest submitted for moderation" });
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
