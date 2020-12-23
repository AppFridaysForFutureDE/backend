import mongoose from "mongoose";

const bannerScheme = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
  link: {
    type: String,
  },
  inApp: {
    type: Boolean,
  },
  campaignBanner: {
    type: Boolean,
  },
});

export const Banner = mongoose.model("banner", bannerScheme);
