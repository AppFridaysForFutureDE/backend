import mongoose from 'mongoose';

// Änderungen dieses Schemas sollten auch in swagger.yaml gespeichert werden
const ogSchema = new mongoose.Schema({
  stadt: {
    type: String,
    required: true
  },
  bundesland: {
    type: String
  },
  name: {
    type: String
  },
  long: {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  zusatzinfo: {
    type: String
  },
  facebook: {
    type: String
  },
  instagram: {
    type: String
  },
  twitter: {
    type: String
  },
  website: {
    type: String
  },
});

export const Og = mongoose.model('og', ogSchema);
