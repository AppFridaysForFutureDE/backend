import { model, Schema, Model, Document } from "mongoose";

export interface IBanner extends Document {
  imageUrl: string;
  link: string;
  inApp: boolean;
  campaignBanner: boolean;
}

// a banner can be either presented
// on the campaign page -> campaignBanner = true
// or on the home page -> campaignBanner = false
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
