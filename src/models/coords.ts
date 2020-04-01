import mongoose from "mongoose";

const coordScheme = new mongoose.Schema({
  city: {
    type: String
  },
  lat: {
    type: Number
  },
  lon: {
    type: Number
  }
});

export const Coord = mongoose.model("coord", coordScheme);
