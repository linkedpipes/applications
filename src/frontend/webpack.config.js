const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, './src/index.html'),
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  entry: [
    path.join(__dirname, '/src/app.js')],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/public'),
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  devtool: dev ? 'inline-source-map': 'source-map',
  devServer: {
    contentBase: path.join(__dirname, "/public"),
    host: '0.0.0.0',
    port: '9000',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  mode: dev ? 'development' : 'production',
  plugins: dev
    ? [
      HTMLWebpackPluginConfig,
      new webpack.HotModuleReplacementPlugin(),
    ]
    : [HTMLWebpackPluginConfig]
};