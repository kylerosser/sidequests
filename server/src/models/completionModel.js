"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CompletionSchema = new mongoose_1.Schema({
    comment: { type: String, required: false },
    completer: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    completedQuest: { type: mongoose_1.Schema.Types.ObjectId, ref: "Quest", required: true },
    checkListIndex: { type: Number, required: true }
}, {
    timestamps: true // adds createdAt and updatedAt Date fields
});
const CompletionModel = (0, mongoose_1.model)('Completion', CompletionSchema);
exports.default = CompletionModel;
