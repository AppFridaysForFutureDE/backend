import { model, Schema, Model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  /* passwordHash: string; */
  admin: boolean;
  /* activeSession: string; */
  /* expiration: number; */
}

const userScheme = new Schema({
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  activeSession: {
    type: String,
  },
  expiration: {
    type: Number,
  },
});

export const User: Model<IUser> = model("user", userScheme);
