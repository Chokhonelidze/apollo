
import mongoose from "mongoose";
const { Schema } = mongoose;


const dishSchema = new Schema({
  id : {
      type: Number,
      unique:true
  },
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  price: {
      type: Number,
  }
});

export const dishes = mongoose.model("dishes",dishSchema);
