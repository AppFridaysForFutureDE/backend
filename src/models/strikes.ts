import mongoose from "mongoose";

// Änderungen dieses Schemas sollten auch in swagger.yaml gespeichert werden
const strikeScheme = new mongoose.Schema({
  stadt: {
    type: String
  },
  bundesland: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  long: {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  uhrzeit: {
    type: Number,
    required: true
  },
  startpunkt: {
    type: String,
    required: true
  },
  facebookEvent: {
    type: String
  },
  zusatzinfo: {
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
