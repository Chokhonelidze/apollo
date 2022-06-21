import mongoose from "mongoose";
const { Schema } = mongoose;


const ordersSchema = new Schema({
  id : {
      type: Number,
      unique:true
  },
  total : {
      type: Number,
  },
  compleated: {
      type: String,
  },
  dishes: {
    type: [Number],
  },
});

export const orders = mongoose.model("orders",ordersSchema);

