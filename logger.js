const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const MAX_SIZE = 5 * 1024 * 1024;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const getLogPath = () => path.join(LOG_DIR, 'crypto.log');

const rotate = () => {
  const logFile = getLogPath();
  if (fs.existsSync(logFile) && fs.statSync(logFile).size > MAX_SIZE) {
    const timestamp = Date.now();
    fs.renameSync(logFile, `${logFile}.${timestamp}.old`);
  }
};

const logger = {
  info: (msg) => {
    rotate();
    const entry = `[${new Date().toISOString()}] INFO: ${msg}\n`;
    process.stdout.write(entry);
    fs.appendFileSync(getLogPath(), entry);
  },
  error: (msg) => {
    rotate();
    const entry = `[${new Date().toISOString()}] ERROR: ${msg}\n`;
    process.stderr.write(entry);
    fs.appendFileSync(getLogPath(), entry);
  }
};

module.exports = logger;