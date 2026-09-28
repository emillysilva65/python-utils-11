const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'crypto.log');

const safeStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return '[Circular or BigInt data detected]';
  }
};

const logger = {
  error: (context, error) => {
    const timestamp = new Date().toISOString();
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : 'No stack trace';
    
    const logEntry = `[${timestamp}] [ERROR] [${context}]: ${message}\n${stack}\n---\n`;
    
    process.stderr.write(logEntry);

    try {
      fs.appendFileSync(logPath, logEntry);
    } catch (fsErr) {
      console.error('CRITICAL_LOG_FAILURE: Unable to write to disk', fsErr);
    }
  },

  trap: (fn, context) => {
    return (...args) => {
      try {
        const result = fn(...args);
        if (result && typeof result.then === 'function') {
          return result.catch(err => logger.error(context, err));
        }
        return result;
      } catch (err) {
        logger.error(context, err);
        return null;
      }
    };
  }
};

module.exports = logger;