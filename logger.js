const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const transportOptions = new transports.File({
    filename: path.join(logDirectory, 'app.log'),
    maxSize: '10m',
    maxFiles: '5',
    tailable: true,
    level: 'info'
});

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [transportOptions]
});

logger.info('Logger initialized');

module.exports = logger;
