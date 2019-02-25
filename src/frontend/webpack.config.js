const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const dev = process.env.NODE_ENV !== "production";

const externalAssets = ["./public/popup.html"];

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
    }),
    new CopyWebpackPlugin(externalAssets.map(a => require.resolve(a)))
  ];

  if (dev) plugins.push(new webpack.HotModuleReplacementPlugin());

  return {
    entry: [path.join(__dirname, "/src/index.jsx")],
    output: {
      path: path.join(__dirname, "/public"),
      filename: "bundle.js"
    },
    resolve: {
      extensions: [".js", ".jsx", ".mjs", ".ts"]
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
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
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
    node: {
      fs: "empty"
    }
  };
};
