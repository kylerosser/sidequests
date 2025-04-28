import { Schema, model, Document, Types } from 'mongoose';

interface IQuest extends Document {
  title: string;
  description: string;
  location: { // GeoJSON object
    type: string;
    coordinates: [number, number]; // [long, lat]
  };
  moderatorApproved: false;
  creator: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestSchema = new Schema<IQuest>(
  { 
    title: { type: String, required: true },
    description: { type: String, required: true},
    location: {
        type: { type: String, required: true },
        coordinates: { type: [Number], required: true }
    },
    moderatorApproved: { type: Boolean, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true // adds createdAt and updatedAt Date fields
  }
);

const QuestModel = model<IQuest>('Quest', QuestSchema);

export default QuestModel;