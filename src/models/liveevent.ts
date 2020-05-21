import mongoose from "mongoose";

const liveeventScheme = new mongoose.Schema({
  liveeventId: {
    type: Number
  },
  isAction: {
    type: Boolean
  },
  actionText: {
    type: String
  },
  actionUrl: {
    type: String
  }
});

export const Liveevent = mongoose.model("liveevent", liveeventScheme);
