import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  name: {
    type: String
  },
  passwordHash: {
    type: String
  },
  admin: {
    type: Boolean
  },
  activeSession: {
    type: String
  }
});

export const User = mongoose.model("user", userScheme);
