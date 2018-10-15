const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = () => {
  const isProduction = process.env.NODE_ENV === "production";

  let pluginsArray = [
    new webpack.DefinePlugin({
      "process.env.BASE_BACKEND_URL": JSON.stringify(
        process.env.BASE_BACKEND_URL
      )
    }),
    new Dotenv()
  ];

  if (!isProduction) {
    pluginsArray.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    entry: [path.join(__dirname, "/src/index.jsx")],
    output: {
      filename: "bundle.js",
      path: path.join(__dirname, "/public", "dist"),
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
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      contentBase: path.join(__dirname, "/public"),
      host: "0.0.0.0",
      port: "9001",
      disableHostCheck: true, // solved Invalid-Host-header
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      historyApiFallback: true,
      publicPath: "/dist/"
    },
    mode: isProduction ? "production" : "development",
    plugins: pluginsArray
  };
};
