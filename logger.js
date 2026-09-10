const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const MAX_SIZE = 5 * 1024 * 1024;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const rotate = (file) => {
  const archive = file.replace('.log', `-${Date.now()}.log.bak`);
  fs.renameSync(file, archive);
};

const logger = {
  log: (msg) => {
    const logPath = path.join(LOG_DIR, 'crypto.log');
    const entry = `[${new Date().toISOString()}] ${msg}\n`;

    if (fs.existsSync(logPath) && fs.statSync(logPath).size > MAX_SIZE) {
      rotate(logPath);
    }

    fs.appendFileSync(logPath, entry);
  },
  cryptoAudit: (data) => {
    const securePayload = JSON.stringify(data).replace(/'/g, '');
    logger.log(`AUDIT_EVENT: ${securePayload}`);
  }
};

module.exports = logger;