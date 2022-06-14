import mongoose from "mongoose";
const { Schema } = mongoose;


const indexesSchema = new Schema({
  id: {
    type: String,
    trim: true,
  },
  value: {
    type: Number,
  }
});

export const indexes = mongoose.model("indexes",indexesSchema);

