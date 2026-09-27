const crypto = require('crypto');

const validatePayload = (data) => {
  const schema = ['nonce', 'signature', 'payload'];
  return schema.every(key => Object.prototype.hasOwnProperty.call(data, key));
};

const processSecureQueue = (queue) => {
  const results = [];
  for (const entry of queue) {
    try {
      if (!validatePayload(entry)) {
        throw new Error('malformed transmission packet');
      }
      
      const hash = crypto
        .createHash('sha256')
        .update(entry.payload + entry.nonce)
        .digest('hex');

      if (!entry.signature.startsWith(hash.substring(0, 8))) {
        throw new Error('integrity mismatch');
      }

      results.push({ status: 'verified', id: hash });
    } catch (e) {
      results.push({ status: 'error', reason: e.message });
    }
  }
  return results;
};

module.exports = { processSecureQueue };