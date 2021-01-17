import { model, Schema, Model, Document } from "mongoose";

export interface ICampaign extends Document {
  name: string;
  icon: string;
  text: string;
  cta: string;
  link: string;
  inApp: boolean;
}

const campaignScheme = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  cta: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  inApp: {
    type: Boolean,
    required: true,
  },
});

export const Campaign: Model<ICampaign> = model("campaign", campaignScheme);
