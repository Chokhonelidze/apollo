import mongoose from "mongoose";
const { Schema } = mongoose;


const ratingsSchema = new Schema({
  id : {
      type: Number,
      unique:true
  },
  ip : {
      type: String,
  },
  type: {
      type: String,
  },
  rating: {
    type: Number,
  },
});

export const ratings = mongoose.model("ratings",ratingsSchema);

