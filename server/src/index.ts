import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

import questRouter from './routes/questRouter';
import userRouter from './routes/userRouter';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

if (process.env.MONGODB_URI == undefined) {
    throw new Error("MongoDB URI not provided");
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use('/quest', questRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});