import { Schema, model, Document, Types } from 'mongoose';

interface ICompletion extends Document {
  description: string;
  starred: boolean;
  completer: Types.ObjectId;
  completedQuest: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompletionSchema = new Schema<ICompletion>(
  {
    description: { type: String, required: true},
    starred: { type: Boolean, required: true },
    completer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completedQuest: { type: Schema.Types.ObjectId, ref: "Quest", required: true },
  },
  {
    timestamps: true // adds createdAt and updatedAt Date fields
  }
);

const CompletionModel = model<ICompletion>('Completion', CompletionSchema);

export default CompletionModel;