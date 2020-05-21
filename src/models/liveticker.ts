import mongoose from "mongoose";

const livetickerScheme = new mongoose.Schema({
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

export const Liveticker = mongoose.model("liveticker", livetickerScheme);
