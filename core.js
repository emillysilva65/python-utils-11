const memoizeCrypto = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = args.join(':');
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    if (cache.size > 1024) cache.delete(cache.keys().next().value);
    return result;
  };
};

const hashProcessor = {
  digest: memoizeCrypto((data, salt) => {
    let h = 0x811c9dc5;
    const combined = data + salt;
    for (let i = 0; i < combined.length; i++) {
      h ^= combined.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16);
  }),
  batchProcess: (items, salt) => {
    const results = new Uint32Array(items.length);
    for (let i = 0; i < items.length; i++) {
      results[i] = parseInt(hashProcessor.digest(items[i], salt), 16);
    }
    return results;
  }
};

export default hashProcessor;