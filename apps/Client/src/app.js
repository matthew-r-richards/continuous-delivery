const express = require('express');
const path = require('path');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const PORT = process.env.PORT || 3000;

const API_URL = 'http://localhost:5000/api';

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
app.get("/api/entries", (req, res) => {
    const options = {
        url: API_URL + '/entries',
        json: true
    }

    request(options, (error, response, body) => {
        if (error) {
            console.log(`Error in making API call to GET ${options.url}: ${error}`);
            res.status(500).send('Error in making API call');
        } else if (response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(500).send('Unexpected response from API');
        }
    });
});

// POST api/entries
app.post("/api/entries", (req, res) => {
    const name = req.body.taskName;
    const description = req.body.taskDescription;

    if (!name || name == '') {
        res.status(400).send('A value must be supplied for taskName');
        return;
    }

    const jsonBody = { "taskName": name, "taskDescription": description };

    const options = {
        url: API_URL + '/entries',
        method: 'POST',
        json: true,
        body: jsonBody
    }

    request(options, (error, response, body) => {
        if (error) {
            console.log(`Error in making API call to POST ${options.url}: ${error}`);
            res.status(500).send('Error in making API call');
        } else if (response.statusCode == 201) {
            res.status(201).send(body);
        } else {
            res.status(500).send('Unexpected response from API');
        }
    });
})

app.listen(PORT, () => {
  console.log('Listening at Port ' + PORT + '...');
});

module.exports = app;