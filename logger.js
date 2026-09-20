const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class HashChainedRotator {
  constructor(baseDir = './logs', maxBytes = 2048) {
    this.baseDir = baseDir;
    this.maxBytes = maxBytes;
    this.lastHash = '0000000000000000000000000000000000000000000000000000000000000000';
    this.currentFile = path.join(this.baseDir, 'crypto-stream.log');
    if (!fs.existsSync(this.baseDir)) fs.mkdirSync(this.baseDir, { recursive: true });
  }

  _computeHash(data) {
    return crypto.createHash('sha256').update(this.lastHash + data).digest('hex');
  }

  rotate() {
    if (!fs.existsSync(this.currentFile)) return;
    const timestamp = Date.now();
    const archivePath = path.join(this.baseDir, `archived-${timestamp}.log`);
    fs.renameSync(this.currentFile, archivePath);
  }

  log(level, payload) {
    const entry = JSON.stringify({
      ts: new Date().toISOString(),
      level: level.toUpperCase(),
      payload,
      prevHash: this.lastHash
    });
    this.lastHash = this._computeHash(entry);
    const line = `${entry} | HASH:${this.lastHash}
`;

    if (fs.existsSync(this.currentFile)) {
      const stats = fs.statSync(this.currentFile);
      if (stats.size >= this.maxBytes) this.rotate();
    }

    fs.appendFileSync(this.currentFile, line, 'utf8');
  }
}

const rotator = new HashChainedRotator();

module.exports = {
  info: (msg) => rotator.log('info', msg),
  warn: (msg) => rotator.log('warn', msg),
  error: (msg) => rotator.log('error', msg),
  auditTx: (txHash, status) => rotator.log('tx', { txHash, status })
};