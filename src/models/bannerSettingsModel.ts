import mongoose from "mongoose";

const bannerScheme = new mongoose.Schema({
  campaignBannerIDs: {
    type: [String]
  },
  feedBannerID: {
    type: String
  }
});

export const BannerSettings = mongoose.model("banner", bannerScheme);
