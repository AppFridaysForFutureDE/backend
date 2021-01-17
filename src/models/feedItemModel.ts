import { model, Schema, Model, Document } from "mongoose";

export interface IFeedItem extends Document {
  imageUrl: string;
  text: string;
  cta: string;
  link: string;
  inApp: boolean;
}

const feedItemScheme = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  cta: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  inApp: {
    type: Boolean,
    required: true,
  },
});

export const feedItem: Model<IFeedItem> = model("feedItem", feedItemScheme);
