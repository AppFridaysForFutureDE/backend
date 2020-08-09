import mongoose from "mongoose";

const sloganScheme = new mongoose.Schema({
  title: {
    type: String
  },
  tags: {
    type: [String]
  },
  text: {
    type: String
  }
});

export const Slogan = mongoose.model("slogan", sloganScheme);
