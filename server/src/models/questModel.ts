import { Schema, model, Document, Types } from 'mongoose';

interface ICheckListItem {
  title: string;
  description: string;
  difficulty: number;
}

interface IQuest extends Document {
  title: string;
  description: string;
  location: { // GeoJSON object
    type: string;
    coordinates: [number, number]; // [long, lat]
  };
  moderatorApproved: false;
  creator: Types.ObjectId;
  checkList: ICheckListItem[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestSchema = new Schema<IQuest>(
  { 
    title: { type: String, required: true },
    description: { type: String, required: true},
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    moderatorApproved: { type: Boolean, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkList: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: Number, required: true}
      }
    ]
  },
  {
    timestamps: true // adds createdAt and updatedAt Date fields
  }
);

QuestSchema.index({ location: '2dsphere' });

const QuestModel = model<IQuest>('Quest', QuestSchema);

export default QuestModel;