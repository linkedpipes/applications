const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const dev = process.env.NODE_ENV !== "production";

module.exports = () => {
  const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: path.join(__dirname, "./src/index.html"),
    filename: "index.html",
    inject: "body"
  });

  const plugins = [
    HTMLWebpackPluginConfig,
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.BASE_BACKEND_URL": JSON.stringify(
        process.env.BASE_BACKEND_URL
      )
    })
  ];

  if (dev) plugins.push(new webpack.HotModuleReplacementPlugin());

  return {
    entry: [path.join(__dirname, "/src/index.jsx")],
    output: {
      path: path.join(__dirname, "/public"),
      filename: "bundle.js"
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
      index: "index.html",
      host: "0.0.0.0",
      port: "9001",
      disableHostCheck: true, // solved Invalid-Host-header
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      historyApiFallback: true
    },
    mode: dev ? "development" : "production",
    plugins: plugins,
    externals: {}
  };
};
