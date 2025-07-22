"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const questsRouter_1 = __importDefault(require("./routes/questsRouter"));
const usersRouter_1 = __importDefault(require("./routes/usersRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const completionsRouter_1 = __importDefault(require("./routes/completionsRouter"));
const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api';
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
if (MONGODB_URI == undefined) {
    throw new Error("MongoDB URI not provided");
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV == "development" ? "http://localhost:5173" : "https://sidequests.nz",
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
app.use(`${API_PREFIX}/quests`, questsRouter_1.default);
app.use(`${API_PREFIX}/users`, usersRouter_1.default);
app.use(`${API_PREFIX}/auth`, authRouter_1.default);
app.use(`${API_PREFIX}/completions`, completionsRouter_1.default);
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Resource not found" });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
