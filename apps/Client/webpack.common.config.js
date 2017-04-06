const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/main.js',
  module: {
    loaders: [
      {
        // Skip any files outside of the project's `src` directory
        include: [
            path.resolve(__dirname, "src"),
        ],
        // Only run `.js` and `.jsx` files through Babel
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
      }
    ]
  },
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      // automatically adds JS, CSS etc. tags to this html file
      template: 'src/index.html'
    })
  ],
  devtool: 'source-map'
}