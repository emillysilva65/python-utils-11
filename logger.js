class Logger {
    constructor(logLevel = 'info') {
        this.logLevel = logLevel;
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
    }

    log(message, level = 'info') {
        if (this.levels[level] >= this.levels[this.logLevel]) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
        }
    }

    debug(message) {
        this.log(message, 'debug');
    }
    info(message) {
        this.log(message, 'info');
    }
    warn(message) {
        this.log(message, 'warn');
    }
    error(message) {
        this.log(message, 'error');
    }
}

const logger = new Logger('debug');

// Sample usage
logger.debug('This is a debug message.');
logger.info('Informational message.');
logger.warn('Warning: Check this out!');
logger.error('Error occurred!');

module.exports = logger;