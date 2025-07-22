"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PasswordResetSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Document will auto-delete upon expiry
}, {
    timestamps: true // adds createdAt and updatedAt Date fields
});
const PasswordResetModel = (0, mongoose_1.model)('PasswordReset', PasswordResetSchema);
exports.default = PasswordResetModel;
