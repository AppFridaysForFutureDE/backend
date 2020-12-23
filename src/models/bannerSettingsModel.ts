import mongoose from "mongoose";

const bannerScheme = new mongoose.Schema({
  feedBannerID: {
    type: String,
  },
});

export const BannerSettings = mongoose.model("bannerSettings", bannerScheme);
