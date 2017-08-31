const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const sourceFolder = path.resolve(__dirname, "./src");
const outputFolder = path.resolve(__dirname, "./dist");
const templateIndex = path.resolve(__dirname, "./src/index.html");
const hotMod = new webpack.HotModuleReplacementPlugin();

module.exports = {
  devtool: "eval",
  entry: [
    "webpack-dev-server/client?http://localhost:3000",
    "webpack/hot/only-dev-server",
    sourceFolder + "/main.js"
  ],
  output: {
    path: outputFolder,
    filename: "bundle.js",
    publicPath: "http://localhost:3000/"
  },
  plugins: [
    hotMod,
    new HtmlWebpackPlugin({
      inject : true,
      template : templateIndex
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"] 
      }
    ]
  }
};