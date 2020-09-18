import mongoose from "mongoose";

const ogScheme = new mongoose.Schema({
  ogId: {
    type: String
  },
  name: {
    type: String
  },
  bundesland: {
    type: String
  },
  lat: {
    type: Number
  },
  lon: {
    type: Number
  },
  whatsapp: {
    type: String
  },
  email: {
    type: String
  },
  instagram: {
    type: String
  },
  twitter: {
    type: String
  },
  facebook: {
    type: String
  },
  youtube: {
    type: String
  },
  website: {
    type: String
  },
  telegram: {
    type: String
  },
  other: {
    type: String
  },
  imageID: {
    type: String
  },
  infoTitle: {
    type: String
  },
  infoText: {
    type: String
  },
  ogContentEndDate: {
    type: String
  },
  retrievedAt: {
    type: Date
  }
});

export const OG = mongoose.model("og", ogScheme);
