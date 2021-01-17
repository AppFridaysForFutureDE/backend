import { model, Schema, Model, Document } from "mongoose";

export interface IStrike extends Document {
  strikeId: string;
  ogId: string;
  name: string;
  location: string;
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
    required: true,
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
    required: true,
  },
  imageUrl: {
    type: String,
  },
  retrievedAt: {
    type: Date,
  },
});

export const Strike: Model<IStrike> = model("strike", strikeScheme);
