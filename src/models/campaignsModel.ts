import mongoose from "mongoose";

const campaignScheme = new mongoose.Schema({
  name: {
    type: String
  },
  icon: {
    type: String
  },
  text: {
    type: String
  },
  cta: {
    type: String
  },
  link: {
    type: String
  },
  sortOrder: {
    type: Number
  },
  inApp: {
    type: Boolean
  },
  active: {
    type: Boolean
  }
});

export const Campaign = mongoose.model("campaign", campaignScheme);
