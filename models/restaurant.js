const mongoose = require("mongoose");
const { Schema } = mongoose;


const restaurantSchema = new Schema({
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
  dishes: {
    type: [[Number]],
  },
});

const restaurant = mongoose.model("restaurants",restaurantSchema);

module.exports = {restaurant};