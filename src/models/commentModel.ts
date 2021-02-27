import { model, Schema, Model, Document } from "mongoose";

// App users can send editorial comments (Leserbriefe)
export interface IComment extends Document {
  name: string;
  content: string;
  publish: boolean;
  articleReference: string;
  age?: number;
  read?: boolean;
}

const commentScheme = new Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  publish: {
    type: Boolean,
    required: true,
  },
  articleReference: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

export const Comment: Model<IComment> = model("comment", commentScheme);
