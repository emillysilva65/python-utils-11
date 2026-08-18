// Simple logger utility for crypto applications

class Logger {
    constructor() {
        this.logs = [];
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push(`${timestamp} - ${message}`);
        console.log(this.logs[this.logs.length - 1]);
    }

    getLogs() {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
    }
}

const logger = new Logger();
export default logger;
