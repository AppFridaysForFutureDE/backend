import { model, Schema, Model, Document } from "mongoose";

export interface ILog extends Document {
  username: string;
  time: number;
  method: string;
  endpoint: string;
  ip: string;
}

const logScheme = new Schema({
  username: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
});

logScheme.methods.readLog = function (this: ILog) {
  return this.ip; // > 0 ? "Male" : "Female"
};

export const Log: Model<ILog> = model("log", logScheme);
