const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const userConfig = require('./config');
const userConfigJSON = {};

const devMode = process.env.NODE_ENV !== 'production';
const path = require('path');

const APP_DIR = path.resolve(__dirname, './src');
const BUILD_DIR = path.resolve(__dirname, './build');

for (const k in userConfig) {
  userConfigJSON[k] = JSON.stringify(userConfig[k]);
}

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
        ...userConfigJSON,
        'NODE_ENV': JSON.stringify('production'),
        'features': {
          'USE_TAGS': JSON.stringify(userConfig.features.USE_TAGS),
          'USE_SEARCH': JSON.stringify(userConfig.features.USE_SEARCH),
          'USE_SITES': JSON.stringify(userConfig.features.USE_SITES),
          'USE_SOURCES': JSON.stringify(userConfig.features.USE_SOURCES)
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
