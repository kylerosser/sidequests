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
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// GET api/users/me
// Retrieve private user profile linked to an authenticated user
router.get("/me", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, data: "Unauthorized" });
        const existingUser = yield userModel_1.default.findOne({ _id: req.user.id });
        if (!existingUser) {
            return res.status(404).json({ success: false, data: "Account does not exist" });
        }
        return res.status(200).json({
            success: true,
            data: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
            },
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
// GET api/users
// Accepts query parameters username or id
// Retrieve public user profile by user id or username
router.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username } = req.query;
    try {
        let existingUser;
        if (id) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid id" });
            }
            existingUser = yield userModel_1.default.findById(id);
        }
        else if (username) {
            existingUser = yield userModel_1.default.findOne({ username: username });
        }
        else {
            return res.status(400).json({ success: false, message: "Query parameter 'id' or 'username' required" });
        }
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            data: {
                id: existingUser.id,
                username: existingUser.username
            },
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
