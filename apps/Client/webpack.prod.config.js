const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');
const path = require('path');
 
module.exports = webpackMerge(commonConfig, {
  output:
  {
    path: path.join(__dirname, 'src', 'dist'),
    filename: 'bundle.js'
  }
});