import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, UserPayload } from "../types/authTypes";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JSON web token secret not provided");
} 

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Bearer <token>

    if (!token) return res.status(401).json({ success: false, message: "Access token missing" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        if (typeof user === "string" || !("id" in user) || !("email" in user)) {
            return res.status(401).json({ success: false, message: "Invalid token payload" });
        }

        req.user = user as UserPayload;
        next();
    });
};