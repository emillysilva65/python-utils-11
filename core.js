const crypto = require('crypto');

const memoizeBufferConversion = (fn) => {
  const cache = new Map();
  return (input) => {
    if (cache.size > 1024) cache.clear();
    if (cache.has(input)) return cache.get(input);
    const result = fn(input);
    cache.set(input, result);
    return result;
  };
};

const computeHash = memoizeBufferConversion((data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
});

class CoreProcessor {
  constructor() {
    this.registry = new WeakMap();
  }

  processBatch(inputs) {
    return inputs.map(input => {
      const cached = this.registry.get(input);
      if (cached) return cached;
      
      const hash = computeHash(input);
      const output = { hash, timestamp: Date.now() };
      this.registry.set(input, output);
      return output;
    });
  }
}

module.exports = new CoreProcessor();