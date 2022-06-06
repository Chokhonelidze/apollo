const mongoose = require("mongoose");
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

const dishes = mongoose.model("dishes",dishSchema);

module.exports = {dishes};