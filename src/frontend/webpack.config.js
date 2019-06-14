const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const dev = process.env.NODE_ENV !== 'production';
const previewSize = process.env.BUNDLE_ANALYZER_ENABLED;

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
      'process.env.SOCKET_RECONNECT': process.env.SOCKET_RECONNECT === 'true',
      'process.env.BUNDLE_ANALYZER_ENABLED':
        process.env.BUNDLE_ANALYZER_ENABLED !== undefined,

      'process.env.BASE_SERVER_PORT': JSON.stringify(
        process.env.BASE_SERVER_PORT === undefined
          ? ''
          : process.env.BASE_SERVER_PORT
      )
    })
  ];

  if (dev) plugins.push(new webpack.HotModuleReplacementPlugin());
  if (previewSize) plugins.push(new BundleAnalyzerPlugin());

  return {
    entry: [path.join(__dirname, '/src/index.jsx')],
    output: {
      path: path.join(__dirname, '/public'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js'
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx'],
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@containers': path.resolve(__dirname, './src/containers'),
        '@ducks': path.resolve(__dirname, './src/ducks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@storage': path.resolve(__dirname, './src/storage'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@assets': path.resolve(__dirname, './assets'),
        'material-ui': 'material-ui/es'
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
        },
        {
          test: /\.(svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    devtool: dev ? 'inline-source-map' : 'source-map',
    devServer: {
      index: 'index.html',
      host: '0.0.0.0',
      port: process.env.BASE_SERVER_PORT,
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
    externals: {
      'node-fetch': 'fetch',
      'text-encoding': 'TextEncoder',
      'whatwg-url': 'window',
      'isomorphic-fetch': 'fetch',
      '@trust/webcrypto': 'crypto'
    }
  };
};
