import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

import questRouter from './routes/questsRouter';
import userRouter from './routes/usersRouter';
import authRouter from './routes/authRouter';

const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api';
const MONGODB_URI = process.env.MONGODB_URI

if (MONGODB_URI == undefined) {
  throw new Error("MongoDB URI not provided");
}

const app = express();
app.use(express.json());

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(`${API_PREFIX}/quests`, questRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/auth`, authRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});