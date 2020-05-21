import mongoose from "mongoose";

const liveeventScheme = new mongoose.Schema({
  livetickerId: {
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

export const Liveevent = mongoose.model("liveticker", liveeventScheme);
