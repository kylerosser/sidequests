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
const authMiddleware_1 = require("../middleware/authMiddleware");
const userModel_1 = __importDefault(require("../models/userModel"));
const completionsService_1 = require("../services/completionsService");
const router = express_1.default.Router();
// GET /api/completions
// Retrieve all completions given certain query parameter options sorted by recency
// ?completedQuest to filter by quest id
// ?completer to filter by user id of the user that completed the quest
// ?cursor a completions id used as a cursor to start fetching from (for infinite scroll pagination)
// ?limit limit the number of completions found
router.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { completedQuest, completer, cursor, limit } = req.query;
    try {
        if (completedQuest !== undefined && typeof completedQuest !== 'string')
            return res.status(400).json({ success: false, data: "completedQuest must be a string" });
        if (completer !== undefined && typeof completedQuest !== 'string')
            return res.status(400).json({ success: false, data: "completer must be a string" });
        if (cursor !== undefined && typeof cursor !== 'string')
            return res.status(400).json({ success: false, data: "cursor must be a string" });
        if (limit !== undefined && isNaN(Number(limit)))
            return res.status(400).json({ success: false, data: "limit must be a number" });
        const limitNumber = (limit !== undefined) ? Number(limit) : undefined;
        const completions = yield completionsService_1.completionsService.findCompletions(completedQuest, completer, cursor, limitNumber);
        const formattedCompletions = completions.map((completion) => {
            return {
                id: completion.id,
                comment: completion.comment,
                completer: completion.completer,
                completedQuest: completion.completedQuest,
                checkListIndex: completion.checkListIndex,
                createdAt: completion.createdAt
            };
        });
        return res.status(200).json({
            success: true,
            data: formattedCompletions
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
// POST /api/completions
// Create a new completion for a quest given a message, checkListIndex and completedQuest quest id
router.post("", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { checkListIndex, comment, completedQuest } = req.body;
    try {
        if (!req.user)
            return res.status(401).json({ success: false, data: "Unauthorized" });
        const user = yield userModel_1.default.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(401).json({ success: false, data: "Unauthorized" });
        }
        if (checkListIndex == null
            || checkListIndex == undefined
            || completedQuest == null
            || completedQuest == undefined
            || comment == null
            || comment == undefined) {
            return res.status(400).json({ success: false, data: "checkListIndex, comment and completedQuest are required" });
        }
        if (typeof checkListIndex !== 'number' ||
            typeof comment !== 'string' ||
            typeof completedQuest !== 'string') {
            return res.status(400).json({
                success: false,
                data: "checkListIndex must be a number, comment and completedQuest must be strings"
            });
        }
        const logCompletionResult = yield completionsService_1.completionsService.logNewCompletion(completedQuest, user.id, checkListIndex, comment);
        if (!(logCompletionResult === null || logCompletionResult === void 0 ? void 0 : logCompletionResult.success)) {
            return res.status(400).json({
                success: false,
                data: logCompletionResult === null || logCompletionResult === void 0 ? void 0 : logCompletionResult.data
            });
        }
        return res.status(200).json({
            success: true,
            data: "Completion successfully logged"
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
