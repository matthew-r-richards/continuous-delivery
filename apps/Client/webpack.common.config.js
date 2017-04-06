const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // when running webpack -p (to build for production) process.env.NODE_ENV will be set to 'production'
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      // automatically adds the <script> tag to this html file
      template: 'src/index.html'
    })
  ],
  devtool: 'source-map'
}