const fs = require('fs');
const path = require('path');

const LOG_DIR = './logs';
const LOG_FILE = path.join(LOG_DIR, 'crypto.log');
const MAX_SIZE = 1024 * 1024 * 5;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const rotate = () => {
  const timestamp = Date.now();
  fs.renameSync(LOG_FILE, `${LOG_FILE}.${timestamp}.old`);
};

const logger = {
  log: (msg) => {
    const entry = `[${new Date().toISOString()}] ${msg}\n`;
    try {
      if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_SIZE) rotate();
      fs.appendFileSync(LOG_FILE, entry);
    } catch (e) {
      process.stderr.write(`Logger failure: ${e.message}\n`);
    }
  },
  info: (msg) => logger.log(`INFO: ${msg}`),
  warn: (msg) => logger.log(`WARN: ${msg}`),
  error: (msg) => logger.log(`ERROR: ${msg}`)
};

module.exports = logger;