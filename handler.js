const crypto = require('crypto');

const hashStream = (data, algo = 'sha256') => {
  const hasher = crypto.createHash(algo);
  hasher.update(data);
  return hasher.digest('hex');
};

const normalizePayload = (input) => {
  try {
    return typeof input === 'string' ? input : JSON.stringify(input);
  } catch (e) {
    return String(input);
  }
};

const processSecurityEvent = (rawInput, options = {}) => {
  const sanitized = normalizePayload(rawInput);
  const algorithm = options.algo || 'sha256';
  
  const signature = hashStream(sanitized, algorithm);
  
  return {
    payloadHash: signature,
    timestamp: Date.now(),
    securityLevel: signature.startsWith('0') ? 'high' : 'standard',
    version: '1.1.0'
  };
};

module.exports = { processSecurityEvent, hashStream };