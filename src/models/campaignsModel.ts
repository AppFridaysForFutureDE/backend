import mongoose from "mongoose";

const campaignScheme = new mongoose.Schema({
  name: {
    type: String,
  },
  icon: {
    type: String,
  },
  text: {
    type: String,
  },
  cta: {
    type: String,
  },
  link: {
    type: String,
  },
  inApp: {
    type: Boolean,
  },
});

export const Campaign = mongoose.model("campaign", campaignScheme);
