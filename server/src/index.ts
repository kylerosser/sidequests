import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import questsRouter from './routes/questsRouter';
import usersRouter from './routes/usersRouter';
import authRouter from './routes/authRouter';
import completionsRouter from './routes/completionsRouter';

const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api';
const MONGODB_URI = process.env.MONGODB_URI
const FRONTEND_URI = process.env.FRONTEND_URI

if (MONGODB_URI == undefined) {
  throw new Error("MongoDB URI not provided");
}

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV == "development" ? "http://localhost:5173" : "https://sidequests.nz",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(`${API_PREFIX}/quests`, questsRouter);
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/completions`, completionsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});