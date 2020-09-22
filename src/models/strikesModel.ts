import mongoose from "mongoose";

const strikeScheme = new mongoose.Schema({
  strikeId: {
    type: String
  },
  ogId: {
    type: String
  },
  name: {
    type: String
  },
  location: {
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
  imageUrl: {
    type: String
  },
  retrievedAt: {
    type: Date
  }
});

export const Strike = mongoose.model("strike", strikeScheme);
