"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false },
    googleId: { type: String, required: false },
    isEmailVerified: { type: Boolean, required: true, default: false },
    lastPasswordReset: { type: Date, required: true, default: new Date(0) }
}, {
    timestamps: true // adds createdAt and updatedAt Date fields
});
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.default = UserModel;
