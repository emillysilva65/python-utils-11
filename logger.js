const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');

const LOG_DIR = './logs';
const MAX_SIZE = 5 * 1024 * 1024;
const LOG_FILE = path.join(LOG_DIR, 'crypto.log');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

class RotatingStream extends Writable {
  _write(chunk, encoding, callback) {
    fs.stat(LOG_FILE, (err, stats) => {
      if (!err && stats.size > MAX_SIZE) {
        const timestamp = Date.now();
        fs.renameSync(LOG_FILE, `${LOG_FILE}.${timestamp}.bak`);
      }
      fs.appendFile(LOG_FILE, chunk, callback);
    });
  }
}

const logger = {
  stream: new RotatingStream(),
  info: (msg) => {
    const entry = `[${new Date().toISOString()}] INFO: ${msg}\n`;
    logger.stream.write(entry);
  },
  error: (msg) => {
    const entry = `[${new Date().toISOString()}] ERROR: ${msg}\n`;
    logger.stream.write(entry);
  }
};

module.exports = logger;