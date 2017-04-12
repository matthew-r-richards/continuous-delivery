const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');
const path = require('path');

module.exports = webpackMerge(commonConfig, {
  externals: [
     {
       'cheerio': 'window',
       'react/addons': true,
       'react/lib/ExecutionEnvironment': true,
       'react/lib/ReactContext': true
     }
  ]
});