const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const userConfig = require('./config');
const devMode = process.env.NODE_ENV !== 'production';
const path = require('path');

const APP_DIR = path.resolve(__dirname, './src');
const BUILD_DIR = path.resolve(__dirname, './build');

const config = {
  entry: {
    index: `${APP_DIR}/index.jsx`,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: `${APP_DIR}`,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }, {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        include: `${APP_DIR}`,
        use: {
          loader: 'babel-loader'
        },
      }, {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
        }
      },
    ],
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  resolve: {
    extensions: ['*', '.js', ],
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'MAPBOX_TOKEN': JSON.stringify(userConfig.MAPBOX_TOKEN),
        'SERVER_ROOT': JSON.stringify(userConfig.SERVER_ROOT),
        'EVENT_EXT': JSON.stringify(userConfig.EVENT_EXT),
        'CATEGORY_EXT': JSON.stringify(userConfig.CATEGORY_EXT),
        'TAG_TREE_EXT': JSON.stringify(userConfig.TAG_TREE_EXT),
        'SITES_EXT': JSON.stringify(userConfig.SITES_EXT),
        'EVENT_DESC_ROOT': JSON.stringify(userConfig.EVENT_DESC_ROOT),
        'MAP_ANCHOR': JSON.stringify(userConfig.MAP_ANCHOR),
        'INCOMING_DATETIME_FORMAT': JSON.stringify(userConfig.INCOMING_DATETIME_FORMAT),
        'features': {
          'USE_TAGS': JSON.stringify(userConfig.features.USE_TAGS),
          'USE_SEARCH': JSON.stringify(userConfig.features.USE_SEARCH),
          'USE_SITES': JSON.stringify(userConfig.features.USE_SITES)
        }
      }
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    })
  ],
};

module.exports = config;
