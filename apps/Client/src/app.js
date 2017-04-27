const express = require('express');
const path = require('path');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const logger = require('./utils/ServerLogger');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const PORT = process.env.PORT || 3000;

const API_URL = process.env.EXTERNAL_API || 'http://localhost:5000/api';

// if we're running in development, use the webpack middleware to serve up the JS
if (process.env.NODE_ENV == 'development') {
    logger.info('Running in development mode...');
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
    logger.info('Running in production mode...');
    app.use(express.static(path.join(__dirname, '../dist')));
}

// serve up the index page
app.get("/", (req,res) => {
    logger.info('GET /');
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// GET api/entries
app.get("/api/entries", (req, res) => {
    logger.info('GET /api/entries');
    const options = {
        url: API_URL + '/entries',
        json: true
    }

    logExternalApiCall(options);

    request(options, (error, response, body) => {
        if (error) {
            logApiCallError(options, error);
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
    logger.info('POST /api/entries');
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

    logExternalApiCall(options);

    request(options, (error, response, body) => {
        if (error) {
            logApiCallError(options, error);
            res.status(500).send('Error in making API call');
        } else if (response.statusCode == 201) {
            res.status(201).send(body);
        } else {
            res.status(500).send('Unexpected response from API');
        }
    });
});

// DELETE api/entries/{id}
app.delete("/api/entries/:id", (req, res) => {
    const id = req.params.id;
    logger.info(`DELETE /api/entries/${id}`);

    const options = {
        url: API_URL + `/entries/${id}`,
        method: 'DELETE',
        json: true
    }

    logExternalApiCall(options);

    request(options, (error, response, body) => {
        if (error) {
            logApiCallError(options, error);
            res.status(500).send('Error in making API call');
        } else if (response.statusCode == 404) {
            res.status(404).send(`Entry with ID ${id} not found`);
        } else if (response.statusCode == 204) {
            res.status(204).send();
        } else {
            res.status(500).send('Unexpected response from API');
        }
    });
});

// POST api/entries/{id}/stop
app.post("/api/entries/:id/stop", (req, res) => {
    const id = req.params.id;
    logger.info(`POST /api/entries/${id}/stop`);

    const options = {
        url: API_URL + `/entries/${id}/stop`,
        method: 'POST',
        json: true
    }

    logExternalApiCall(options);

    request(options, (error, response, body) => {
        if (error) {
            logApiCallError(options, error);
            res.status(500).send('Error in making API call');
        } else if (response.statusCode == 404) {
            res.status(404).send(`Entry with ID ${id} not found`);
        } else if (response.statusCode == 200) {
            res.status(200).send(body);
        } else {
            res.status(500).send('Unexpected response from API');
        }
    });
});

function logExternalApiCall(options) {
    logger.info(`Calling external API at ${options.method} ${options.url}`);
}

function logApiCallError(options, error) {
    logger.error(`Error in making API call to ${options.method} ${options.url}: ${error}`);
}

app.listen(PORT, () => {
  logger.info('Listening at Port ' + PORT + '...');
});

module.exports = app;