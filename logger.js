const fs = require('fs');
const path = require('path');

const LOG_FILE = 'crypto-ops.log';
const MAX_SIZE = 1024 * 512;

function rotateLogs() {
  if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_SIZE) {
    const timestamp = Date.now();
    fs.renameSync(LOG_FILE, `crypto-ops-${timestamp}.log`);
  }
}

const logger = {
  log: (message, level = 'INFO') => {
    rotateLogs();
    const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, entry);
  },
  cryptoAudit: (data) => {
    const mask = JSON.stringify(data).replace(/:"[^"]{10,}"/g, ':"***masked***"');
    logger.log(`AUDIT: ${mask}`, 'SECURITY');
  }
};

module.exports = logger;