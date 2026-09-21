const fs = require('fs');
const path = require('path');

const LOG_DIR = './logs';
const MAX_SIZE = 1024 * 1024 * 5;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const logger = (msg, level = 'INFO') => {
  const logPath = path.join(LOG_DIR, 'crypto.log');
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] [${level}] ${msg}\n`;

  try {
    const stats = fs.existsSync(logPath) ? fs.statSync(logPath) : { size: 0 };
    
    if (stats.size > MAX_SIZE) {
      const backup = path.join(LOG_DIR, `crypto.${Date.now()}.log`);
      fs.renameSync(logPath, backup);
    }

    fs.appendFileSync(logPath, entry);
  } catch (err) {
    process.stderr.write(`Logger failure: ${err.message}\n`);
  }
};

module.exports = {
  info: (msg) => logger(msg, 'INFO'),
  error: (msg) => logger(msg, 'ERROR'),
  warn: (msg) => logger(msg, 'WARN')
};