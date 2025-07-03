import { Schema, model, Document, Types } from 'mongoose';

interface IPasswordReset extends Document {
    user: Types.ObjectId;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Document will auto-delete upon expiry
  },
  {
    timestamps: true // adds createdAt and updatedAt Date fields
  }
);

const PasswordResetModel = model<IPasswordReset>('PasswordReset', PasswordResetSchema);

export default PasswordResetModel;