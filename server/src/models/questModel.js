"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const QuestSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    moderatorApproved: { type: Boolean, required: true },
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    checkList: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            difficulty: { type: Number, required: true }
        }
    ]
}, {
    timestamps: true // adds createdAt and updatedAt Date fields
});
QuestSchema.index({ location: '2dsphere' });
const QuestModel = (0, mongoose_1.model)('Quest', QuestSchema);
exports.default = QuestModel;
