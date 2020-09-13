import mongoose from "mongoose";

const feedItemScheme = new mongoose.Schema({
  imageUrl: {
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
  inApp: {
    type: Boolean
  }
});

export const feedItem = mongoose.model("feedItem", feedItemScheme);
