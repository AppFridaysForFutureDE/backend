import mongoose from "mongoose";

const logScheme = new mongoose.Schema({
  username: {
    type: String
  },
  time: {
    type: Number
  },
  method: {
    type: String
  },
  endpoint: {
    type: String
  },
  ip: {
    type: String
  }
});

export const Log = mongoose.model("log", logScheme);
