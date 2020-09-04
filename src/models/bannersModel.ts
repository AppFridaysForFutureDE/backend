import mongoose from "mongoose";

const bannerScheme = new mongoose.Schema({
  imageUrl: {
    type: String
  },
  link: {
    type: String
  },
  sortOrder: {
    type: Number
  },
  createdAt: {
    type: Date
  },
  inApp: {
    type: Boolean
  },
  active: {
    type: Boolean
  }
});

export const Banner = mongoose.model("banner", bannerScheme);
