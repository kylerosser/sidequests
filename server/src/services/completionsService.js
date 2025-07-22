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
exports.completionsService = void 0;
const mongoose_1 = require("mongoose");
const questModel_1 = __importDefault(require("../models/questModel"));
const completionModel_1 = __importDefault(require("../models/completionModel"));
exports.completionsService = {
    logNewCompletion: (completedQuest, userId, checkListIndex, comment) => __awaiter(void 0, void 0, void 0, function* () {
        const quest = yield questModel_1.default.findOne({ _id: completedQuest });
        if (!quest) {
            return { success: false, data: "Invalid quest id" };
        }
        const existingCompletion = yield completionModel_1.default.findOne({ completer: userId, completedQuest: quest === null || quest === void 0 ? void 0 : quest.id, checkListIndex: checkListIndex });
        if (existingCompletion) {
            return { success: false, data: "A completion for this quest checklist item already exists" };
        }
        const newCompletion = new completionModel_1.default({
            completedQuest,
            completer: userId,
            checkListIndex,
            comment: comment,
        });
        yield newCompletion.save();
        return { success: true, data: "Completion logged" };
    }),
    findCompletions: (completedQuest, completer, cursor, limit) => __awaiter(void 0, void 0, void 0, function* () {
        const query = {};
        if (cursor)
            query._id = { $lt: new mongoose_1.Types.ObjectId(cursor) };
        if (completedQuest)
            query.completedQuest = completedQuest;
        if (completer)
            query.completer = completer;
        if (!limit)
            limit = 20; // default fallback limit
        const foundCompletions = yield completionModel_1.default.find(query).populate('completer', { username: 1 }).sort({ _id: -1 }).limit(limit);
        return foundCompletions;
    })
};
