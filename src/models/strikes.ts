import mongoose from "mongoose";

// Änderungen dieses Schemas sollten auch in swagger.yaml gespeichert werden
const strikeScheme = new mongoose.Schema({
  name: {
    type: String
  },
  time: {
    type: String
  },
  startingPoint: {
    type: String
  },
  fbEvent: {
    type: String
  },
  additionalInfo: {
    type: String
  },
  notificationSent: {
    type: Boolean
  }
});

export const Strike = mongoose.model("strike", strikeScheme);
