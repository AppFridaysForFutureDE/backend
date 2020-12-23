import mongoose from "mongoose";

const sloganScheme = new mongoose.Schema({
  tags: {
    type: [String],
  },
  text: {
    type: String,
  },
});

export const Slogan = mongoose.model("slogan", sloganScheme);
