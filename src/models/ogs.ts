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
  WhatsApp: {
    type: String
  },
  WhatsAppStud: {
    type: String
  },
  Email: {
    type: String
  },
  Instagram: {
    type: String
  },
  Twitter: {
    type: String
  },
  Facebook: {
    type: String
  },
  Website: {
    type: String
  },
  Telegram: {
    type: String
  },
  retrievedAt: {
    type: Date
  }
});

export const Og = mongoose.model("og", ogScheme);
