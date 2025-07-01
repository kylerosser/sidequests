import { Schema, model, Document, Types } from 'mongoose';

interface IEmailVerification extends Document {
    user: Types.ObjectId;
    token: string;
    hasBeenResent: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    hasBeenResent: { type: Boolean, required: true, default: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Document will auto-delete upon expiry
  },
  {
    timestamps: true // adds createdAt and updatedAt Date fields
  }
);

const UserModel = model<IEmailVerification>('EmailVerification', EmailVerificationSchema);

export default UserModel;