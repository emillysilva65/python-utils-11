const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class RotatableCryptoLogger {
  constructor(options = {}) {
    this.dir = options.dir || './logs';
    this.maxBytes = options.maxBytes || 1024 * 10;
    this.maxFiles = options.maxFiles || 5;
    this.lastHash = '0'.repeat(64);
    this.currentFile = path.join(this.dir, 'crypto-audit.log');
    
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
  }

  _rotate() {
    if (!fs.existsSync(this.currentFile)) return;
    const stats = fs.statSync(this.currentFile);
    if (stats.size < this.maxBytes) return;

    for (let i = this.maxFiles - 1; i >= 1; i--) {
      const oldPath = path.join(this.dir, `crypto-audit.${i}.log`);
      const newPath = path.join(this.dir, `crypto-audit.${i + 1}.log`);
      if (fs.existsSync(oldPath)) {
        if (i + 1 > this.maxFiles) fs.unlinkSync(oldPath);
        else fs.renameSync(oldPath, newPath);
      }
    }
    fs.renameSync(this.currentFile, path.join(this.dir, 'crypto-audit.1.log'));
  }

  log(level, payload) {
    this._rotate();
    const timestamp = new Date().toISOString();
    const logObject = { timestamp, level, payload, prevHash: this.lastHash };
    
    this.lastHash = crypto.createHash('sha256').update(JSON.stringify(logObject)).digest('hex');
    const entry = JSON.stringify({ ...logObject, hash: this.lastHash }) + '\n';
    
    fs.appendFileSync(this.currentFile, entry, 'utf8');
    return this.lastHash;
  }
}

module.exports = { RotatableCryptoLogger };