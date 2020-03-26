import mongoose from "mongoose";

// Änderungen dieses Schemas sollten auch in swagger.yaml gespeichert werden
const strikeScheme = new mongoose.Schema({
  city: {
    type: String
  },
  bundesland: {
    type: String
  },
  name: {
    type: String
  },
  long: {
    type: Number
  },
  lat: {
    type: Number
  },
  time: {
    type: String
  },
  startingPoint: {
    type: String
  },
  fbEvent: {
    type: String
  },
  additionalInfo: {
    type: String
  },
  facebook: {
    type: String
  },
  instagram: {
    type: String
  },
  twitter: {
    type: String
  },
  website: {
    type: String
  },
  notificationSent: {
    type: Boolean
  }
});

export const Strike = mongoose.model("strike", strikeScheme);
