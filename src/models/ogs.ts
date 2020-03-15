import mongoose from 'mongoose';

const OgSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

export const Og = mongoose.model('og', OgSchema);