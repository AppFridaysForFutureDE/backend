import { model, Schema, Model, Document } from "mongoose";

export interface IStrike extends Document {
  strikeId: string;
  ogId: string;
  name: string;
}

const strikeScheme = new Schema({
  strikeId: {
    type: String,
    required: true,
  },
  ogId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  date: {
    type: Number,
  },
  eventLink: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
  notificationSent: {
    type: Boolean,
  },
  imageUrl: {
    type: String,
  },
  retrievedAt: {
    type: Date,
  },
});

export const Strike: Model<IStrike> = model("strike", strikeScheme);
