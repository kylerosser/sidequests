"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JSON web token secret not provided");
}
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ success: false, message: "Access token missing" });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        if (typeof user === "string" || !("id" in user) || !("email" in user)) {
            return res.status(401).json({ success: false, message: "Invalid token payload" });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
