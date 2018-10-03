const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const dev = process.env.NODE_ENV !== "production";

const Dotenv = require("dotenv-webpack");

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, "./src/index.html"),
  filename: "index.html",
  inject: "body"
});

module.exports = {
  entry: [path.join(__dirname, "/src/index.jsx")],
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "/public"),
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.jsx$/,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  devtool: dev ? "inline-source-map" : "source-map",
  devServer: {
    contentBase: path.join(__dirname, "/public"),
    host: "0.0.0.0",
    port: "9000",
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    historyApiFallback: true
  },
  mode: dev ? "development" : "production",
  plugins: dev
    ? [
        HTMLWebpackPluginConfig,
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv()
      ]
    : [HTMLWebpackPluginConfig]
};
