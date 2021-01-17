import { model, Schema, Model, Document } from "mongoose";

export interface IBanner extends Document {
  imageUrl: string;
  link: string;
  inApp: boolean;
  campaignBanner: boolean;
}

const bannerScheme = new Schema({
  imageUrl: {
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
  campaignBanner: {
    type: Boolean,
    required: true,
  },
});

export const Banner: Model<IBanner> = model("banner", bannerScheme);
