const validateCryptoPayload = (payload) => {
  const schema = { hash: 'string', nonce: 'number', signature: 'string' };
  return Object.entries(schema).every(([key, type]) => typeof payload[key] === type);
};

const processCryptoQueue = (queue) => {
  for (const entry of queue) {
    try {
      if (!validateCryptoPayload(entry)) {
        throw new Error('invalid crypto signature format');
      }
      console.log(`[SECURE]: processing block ${entry.hash.substring(0, 8)}`);
      entry.processed = true;
    } catch (e) {
      console.error(`[ALERT]: ${e.message} - dropping packet`);
    }
  }
};

const logger = {
  log: (msg) => console.log(`[INFO] ${new Date().toISOString()}: ${msg}`),
  stream: (data) => {
    if (!Array.isArray(data)) return logger.log('stream error: invalid data type');
    processCryptoQueue(data);
  }
};

module.exports = logger;