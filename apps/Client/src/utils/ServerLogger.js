const winston = require('winston');

let logger;

if (process.env.NODE_ENV === 'test') {
    // only log to file when testing, so that we don't fill up the console
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                filename: 'logs/client-app-testing.log',
                maxsize: 1048576,
                maxfiles: 5,
                tailable: true,
                json: false
            })
        ]
    });
} else if (process.env.NODE_ENV === 'production') {
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({
                filename: 'logs/client-app.log',
                maxsize: 1048576,
                maxfiles: 5,
                tailable: true,
                json: false
            })
        ]
    });
} else {
    // only log to the console in development
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)()
        ]
    });
}

module.exports = logger;