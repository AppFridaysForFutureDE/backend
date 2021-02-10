import { model, Schema, Model, Document } from "mongoose";

export interface IOg extends Document {
  ogId: string;
  name: string;
  bundesland: string;
  lat: number;
  long: number;
}

const ogScheme = new Schema({
  ogId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  bundesland: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  whatsapp: {
    type: String,
  },
  email: {
    type: String,
  },
  instagram: {
    type: String,
  },
  twitter: {
    type: String,
  },
  facebook: {
    type: String,
  },
  youtube: {
    type: String,
  },
  website: {
    type: String,
  },
  telegram: {
    type: String,
  },
  other: {
    type: String,
  },
  imageLink: {
    type: String,
  },
  infoTitle: {
    type: String,
  },
  infoText: {
    type: String,
  },
  ogContentEndDate: {
    type: String,
  },
  retrievedAt: {
    type: Date,
  },
});

export const OG: Model<IOg> = model("og", ogScheme);
