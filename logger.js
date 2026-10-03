const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'crypto.log');
const MAX_SIZE = 1024 * 1024 * 5;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

function rotate() {
  if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_SIZE) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.renameSync(LOG_FILE, `${LOG_FILE}.${timestamp}.old`);
  }
}

module.exports = {
  log: (message) => {
    rotate();
    const entry = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, entry);
  },
  cryptoAudit: (data) => {
    const payload = typeof data === 'object' ? JSON.stringify(data) : data;
    module.exports.log(`AUDIT: ${payload}`);
  }
};