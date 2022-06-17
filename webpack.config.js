const path = require("path");
const DotenvPlugin = require("dotenv-webpack");

module.exports = {
  entry: "./index.js",
  plugins: [new DotenvPlugin({ systemvars: true })],
};