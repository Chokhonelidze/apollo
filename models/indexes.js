const mongoose = require("mongoose");
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

const indexes = mongoose.model("indexes",indexesSchema);

module.exports = {indexes};