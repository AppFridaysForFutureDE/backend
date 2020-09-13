import mongoose from "mongoose";

const bannerScheme = new mongoose.Schema({
  campaignBannerIDs: {
    type: [String]
  },
  feedBannerID: {
    type: String
  }
});

export const Banner = mongoose.model("banner", bannerScheme);
