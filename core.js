const crypto = require('crypto');

const validatePayload = (data) => {
  const schema = { hash: 'string', nonce: 'number', signature: 'string' };
  return Object.keys(schema).every(key => typeof data[key] === schema[key]);
};

const processQueue = async (queue) => {
  for (const entry of queue) {
    try {
      if (!validatePayload(entry)) {
        console.error('invalid structure encountered, skipping entry');
        continue;
      }

      const checksum = crypto.createHash('sha256').update(entry.hash + entry.nonce).digest('hex');
      
      if (checksum.slice(0, 4) !== '0000') {
        throw new Error('invalid proof of work');
      }

      await commitToLedger(entry);
    } catch (err) {
      console.warn(`processing failure: ${err.message}`);
    }
  }
};

const commitToLedger = async (data) => {
  // simulated db write for crypto assets
  return Promise.resolve(true);
};

module.exports = { processQueue };