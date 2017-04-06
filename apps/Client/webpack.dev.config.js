const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');
 
module.exports = webpackMerge(commonConfig, {
  entry: 
  [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/main.js'
  ],
  output:
  {
    path: '/',
    publicPath: 'http://localhost:3000/',
    filename: 'bundle.js'
  }
});