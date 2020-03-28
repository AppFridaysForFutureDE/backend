import mongoose from "mongoose";

const strikeScheme = new mongoose.Schema({
  name: {
    type: String
  },
  date: {
    type: Date
  },
  startingPoint: {
    type: String
  },
  fbEvent: {
    type: String
  },
  additionalInfo: {
    type: String
  },
  notificationSent: {
    type: Boolean
  },
  retrievedAt: {
    type: Date
  }
});

export const Strike = mongoose.model("strike", strikeScheme);
