import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

import questRouter from './routes/questRouter';
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI
if (MONGODB_URI == undefined) {
  throw new Error("MongoDB URI not provided");
}

const app = express();
app.use(express.json());

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use('/quest', questRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});