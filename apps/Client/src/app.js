const express = require("express");
const app = express();

const PORT = 3000;

// serve static content
app.use(express.static(__dirname));

// if we're running in development, use the webpack middleware to serve up the JS
if (app.settings.env == 'development') {
    console.log('Running in development mode...');
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: {colors: true}
    }));

    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }))
}

// serve up the index page
app.get("/", (req,res) => {
  res.sendFile(__dirname + "index.html");
});

app.listen(PORT, () => {
  console.log('Listening at Port ' + PORT + '...');
});