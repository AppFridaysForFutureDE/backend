import mongoose from "mongoose";

const liveeventScheme = new mongoose.Schema({
  liveeventId: {
    type: Number,
  },
  isActive: {
    type: Boolean,
  },
  actionText: {
    type: String,
  },
  actionUrl: {
    type: String,
  },
  inApp: {
    type: Boolean,
  },
});

export const Liveevent = mongoose.model("liveevent", liveeventScheme);
