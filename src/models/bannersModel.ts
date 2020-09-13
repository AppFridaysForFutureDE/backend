import mongoose from "mongoose";

const bannerScheme = new mongoose.Schema({
  id: {
    type: Number
  },
  imageUrl: {
    type: String
  },
  link: {
    type: String
  },
  inApp: {
    type: Boolean
  },
  active: {
    type: Boolean
  }
});

export const Banner = mongoose.model("banner", bannerScheme);
