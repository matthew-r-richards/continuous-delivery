var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './src/main.js',
  output:
  {
    path: path.join(__dirname, 'src', 'js'),
    filename: 'bundle.js'
  },
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
};