import { Schema, model, Document, Types } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  isEmailVerified: boolean;
  lastPasswordReset: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false },
    googleId: { type: String, required: false },
    isEmailVerified: { type: Boolean, required: true, default: false },
    lastPasswordReset: { type: Date, required: true, default: new Date(0)}
  },
  {
    timestamps: true // adds createdAt and updatedAt Date fields
  }
);

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;