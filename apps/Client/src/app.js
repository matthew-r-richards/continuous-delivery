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

// GET api/entries
app.get("/api/entries", (req,res) => {
    // just return some fake data for now
    const startTime1 = new Date();
    startTime1.setHours(9);
    startTime1.setMinutes(0);
    const endTime1 = new Date();
    endTime1.setHours(11);
    endTime1.setMinutes(30);
    const startTime2 = endTime1;
    const endTime2 = new Date();
    endTime2.setHours(13);
    endTime2.setMinutes(10);
    const startTime3 = endTime2;

    const fakeEntries = [
        { name: 'Entry 1', description: 'Description 1', start: startTime1, end: endTime1 },
        { name: 'Entry 2', description: 'Description 2', start: startTime2, end: endTime2 },
        { name: 'Entry 3', description: 'Description 3', start: startTime3, end: null }
    ];

    res.json(fakeEntries);
});

app.listen(PORT, () => {
  console.log('Listening at Port ' + PORT + '...');
});