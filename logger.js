const fs = require('fs');
const path = require('path');

class Logger {
    constructor(logDir, maxSize) {
        this.logDir = logDir;
        this.maxSize = maxSize;
        this.currentLogFile = path.join(logDir, 'app.log');
        this.logStream = fs.createWriteStream(this.currentLogFile, { flags: 'a' });
    }

    log(message) {
        const logMessage = `${new Date().toISOString()} - ${message}\n`;
        this.logStream.write(logMessage);
        this.checkRotation();
    }

    checkRotation() {
        const stats = fs.statSync(this.currentLogFile);
        if (stats.size > this.maxSize) {
            this.rotateLogs();
        }
    }

    rotateLogs() {
        const timestamp = new Date().toISOString().replace(/[:]/g, '-');
        const newLogFileName = path.join(this.logDir, `app-${timestamp}.log`);
        fs.renameSync(this.currentLogFile, newLogFileName);
        this.logStream.end();
        this.logStream = fs.createWriteStream(this.currentLogFile, { flags: 'a' });
    }
}

module.exports = Logger;