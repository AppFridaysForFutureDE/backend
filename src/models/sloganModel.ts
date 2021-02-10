import { model, Schema, Model, Document } from "mongoose";

export interface ISlogan extends Document {
  tags?: [string];
  text: string;
}

const sloganScheme = new Schema({
  tags: {
    type: [String],
  },
  text: {
    type: String,
    required: true,
  },
});

export const Slogan: Model<ISlogan> = model("slogan", sloganScheme);
