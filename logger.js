const fs = require('fs');
const path = require('path');
const { format, createLogger, transports } = require('winston');

const logDirectory = path.resolve(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const createLogFileName = () => {
    const date = new Date();
    return `crypto-log-${date.toISOString().split('T')[0]}.log`;
};

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.File({
            filename: path.join(logDirectory, createLogFileName()),
            maxsize: 5 * 1024 * 1024,
            maxFiles: '14d',
            tailable: true,
        }),
        new transports.Console(),
    ],
});

module.exports = logger;
