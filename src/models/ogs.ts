import mongoose from "mongoose";

const ogScheme = new mongoose.Schema({
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
  whatsApp: {
    type: String
  },
  whatsAppStud: {
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
  website: {
    type: String
  },
  telegram: {
    type: String
  },
  retrievedAt: {
    type: Date
  }
});

export const Og = mongoose.model("og", ogScheme);
