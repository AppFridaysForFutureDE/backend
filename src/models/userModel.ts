import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  name: {
    type: String
  },
  passwordHash: {
    type: String
  },
  salt: {
    type: String
  },
  admin: {
    type: Boolean
  },
  activeSession: {
    type: String
  },
  expiration: {
    type: Number
  } 
});

export const User = mongoose.model("user", userScheme);
