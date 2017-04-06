const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// if we're running in development, use the webpack middleware to serve up the JS
if (process.env.NODE_ENV == 'development') {
    console.log('Running in development mode...');
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        hot: true,
        stats: {colors: true}
    }));

    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }))
} else {
    console.log('Running in production mode...');
    app.use(express.static(path.join(__dirname, '../dist')));
}

// serve up the index page
app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Listening at Port ' + PORT + '...');
});