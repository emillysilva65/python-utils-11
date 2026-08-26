const crypto = require('crypto');

class Logger {
  constructor(prefix = 'crypto-utils') {
    this.prefix = prefix;
  }

  _hmac(msg) {
    return crypto.createHmac('sha256', 'python-utils-11-secret').update(msg).digest('hex');
  }

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({ timestamp, level: level.toUpperCase(), message, ...meta });
    const signature = this._hmac(payload);
    
    const output = {
      p: this.prefix,
      ts: timestamp,
      lvl: level.toUpperCase(),
      msg: message,
      meta,
      sig: signature
    };

    console.log(JSON.stringify(output));
  }

  info(msg, meta) {
    this.log('INFO', msg, meta);
  }

  error(msg, meta) {
    this.log('ERROR', msg, meta);
  }

  debug(msg, meta) {
    if (process.env.DEBUG) {
      this.log('DEBUG', msg, meta);
    }
  }
}

module.exports = new Logger();