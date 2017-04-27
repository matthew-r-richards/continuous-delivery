import log from 'minilog';

const logger = log('client-app');

if (process.env && process.env.NODE_ENV === 'test') {
    log.disable();
} else {
    log.enable();
}

export default logger;