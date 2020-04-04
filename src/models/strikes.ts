import mongoose from "mongoose";

const strikeScheme = new mongoose.Schema({
  ogId: {
    type: String
  },
  startingPoint: {
    type: String
  },
  date: {
    type: Number
  },
  eventLink: {
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
