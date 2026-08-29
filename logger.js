const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const setupLogger = (options = {}) => {
  const logDir = options.dir || './logs';
  const baseLogFile = path.join(logDir, 'app.log');
  const maxSizeBytes = options.maxSize || 1048576;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const rotateIfNeeded = () => {
    if (!fs.existsSync(baseLogFile)) {
      return;
    }
    const stats = fs.statSync(baseLogFile);
    if (stats.size >= maxSizeBytes) {
      const seed = `${Date.now()}-${Math.random()}`;
      const hash = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 10);
      const rotatedFile = path.join(logDir, `rotated-${hash}.log`);
      fs.renameSync(baseLogFile, rotatedFile);
    }
  };
  const log = (level, message) => {
    rotateIfNeeded();
    const timestamp = new Date().toISOString();
    const entry = `${timestamp} [${level}] ${message}\n`;
    fs.appendFileSync(baseLogFile, entry);
  };
  return {
    info: (msg) => log('INFO', msg),
    warn: (msg) => log('WARN', msg),
    error: (msg) => log('ERROR', msg),
    debug: (msg) => log('DEBUG', msg),
    cryptoEvent: (event) => {
      const hash = crypto.createHash('md5').update(JSON.stringify(event)).digest('hex');
      log('CRYPTO', `Event: ${event.type} hash: ${hash}`);
    }
  };
};
module.exports = setupLogger;