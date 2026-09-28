const crypto = require('crypto');

const validatePayload = (data) => {
  const schema = { hash: 'string', nonce: 'number' };
  return Object.keys(schema).every(k => typeof data[k] === schema[k]);
};

const processLoop = (queue) => {
  while (queue.length > 0) {
    const entry = queue.shift();
    
    try {
      if (!validatePayload(entry)) {
        throw new Error('MALFORMED_CRYPTO_FRAME');
      }

      const hmac = crypto.createHmac('sha256', process.env.SECRET || 'dev-key')
        .update(entry.nonce.toString())
        .digest('hex');

      if (hmac === entry.hash) {
        console.log(`Verified block ${entry.nonce}`);
      } else {
        console.warn(`Tamper detected at nonce ${entry.nonce}`);
      }
    } catch (e) {
      console.error(`Validation sequence failure: ${e.message}`);
    }
  }
};

module.exports = { processLoop };