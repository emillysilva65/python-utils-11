const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');

class CryptoRotateStream extends Writable {
  constructor(basePath, maxSize = 1024 * 1024) {
    super();
    this.basePath = basePath;
    this.maxSize = maxSize;
    this.currentStream = fs.createWriteStream(basePath, { flags: 'a' });
  }

  _write(chunk, encoding, callback) {
    fs.stat(this.basePath, (err, stats) => {
      if (!err && stats.size > this.maxSize) {
        this.currentStream.end();
        fs.renameSync(this.basePath, `${this.basePath}.${Date.now()}.log`);
        this.currentStream = fs.createWriteStream(this.basePath, { flags: 'a' });
      }
      this.currentStream.write(chunk, encoding, callback);
    });
  }
}

const logger = {
  stream: new CryptoRotateStream(path.join(__dirname, 'crypto.log')),
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