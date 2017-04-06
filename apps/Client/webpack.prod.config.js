const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
 
module.exports = webpackMerge(commonConfig, {
  output:
  {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.[hash].js'
  },
  plugins: [
    new ExtractTextPlugin('bundle.[hash].css')
  ]
});