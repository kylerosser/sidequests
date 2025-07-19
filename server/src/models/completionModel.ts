import { Schema, model, Document, Types } from 'mongoose';

interface ICompletion extends Document {
  comment: string;
  completer: Types.ObjectId;
  completedQuest: Types.ObjectId;
  checkListIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

const CompletionSchema = new Schema<ICompletion>(
  {
    comment: { type: String, required: true},
    completer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completedQuest: { type: Schema.Types.ObjectId, ref: "Quest", required: true },
    checkListIndex: { type: Number, required: true}
  },
  {
    timestamps: true // adds createdAt and updatedAt Date fields
  }
);

const CompletionModel = model<ICompletion>('Completion', CompletionSchema);

export default CompletionModel;