const crypto = require('crypto');

const memoizeCrypto = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    if (cache.size > 1000) cache.delete(cache.keys().next().value);
    return result;
  };
};

const fastHash = memoizeCrypto((data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
});

class CryptoEngine {
  constructor(secret) {
    this.secret = secret;
    this.buffer = new Uint8Array(1024);
  }

  process(payload) {
    const startTime = process.hrtime.bigint();
    const hashed = fastHash(payload + this.secret);
    const duration = Number(process.hrtime.bigint() - startTime);
    
    return {
      hash: hashed,
      latencyNs: duration,
      timestamp: Date.now()
    };
  }

  clearMemory() {
    this.buffer.fill(0);
  }
}

module.exports = { CryptoEngine };