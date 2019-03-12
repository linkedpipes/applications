const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

const externalAssets = ["./public/popup.html"];

module.exports = () => {
  const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: path.join(__dirname, './src/index.html'),
    filename: 'index.html',
    inject: 'body'
  });

  const plugins = [
    HTMLWebpackPluginConfig,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BASE_BACKEND_URL': JSON.stringify(
        process.env.BASE_BACKEND_URL
      ),
      'process.env.BASE_SOCKET_URL': JSON.stringify(
        process.env.BASE_SOCKET_URL
      ),
      'process.env.SOCKET_RECONNECT':
        JSON.stringify(process.env.SOCKET_RECONNECT) === 'true'
    })
  ];

  if (dev) plugins.push(new webpack.HotModuleReplacementPlugin());

  return {
    entry: [path.join(__dirname, '/src/index.jsx')],
    output: {
      path: path.join(__dirname, '/public'),
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx'],
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@containers': path.resolve(__dirname, './src/containers'),
        '@ducks': path.resolve(__dirname, './src/ducks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@layouts': path.resolve(__dirname, './src/layouts')
      }
    },
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.jsx$/,
          exclude: /node_modules/
        },
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
            'webpack-conditional-loader'
          ]
        }
      ]
    },
    devtool: dev ? 'inline-source-map' : 'source-map',
    devServer: {
      index: 'index.html',
      host: '0.0.0.0',
      port: '9001',
      disableHostCheck: true, // solved Invalid-Host-header
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      historyApiFallback: true
    },
    node: {
      fs: 'empty'
    },
    mode: dev ? 'development' : 'production',
    plugins,
    externals: {}
  };
};
