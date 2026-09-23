const memoizedBuffer = new Map();
const MAX_CACHE = 1000;

/**
 * optimized event logging with LRU-style
 * circular cache eviction for high-frequency crypto logs
 */
function logCryptoEvent(level, data) {
  const timestamp = Date.now();
  const payload = JSON.stringify(data);
  const key = `${timestamp}:${payload.slice(0, 32)}`;

  if (memoizedBuffer.size >= MAX_CACHE) {
    const firstKey = memoizedBuffer.keys().next().value;
    memoizedBuffer.delete(firstKey);
  }

  memoizedBuffer.set(key, { level, payload, timestamp });

  if (process.env.NODE_ENV !== 'production') {
    process.stdout.write(`[${level}] ${key}\n`);
  }
}

function flushLogs() {
  const snapshot = Array.from(memoizedBuffer.values());
  memoizedBuffer.clear();
  return snapshot;
}

module.exports = { logCryptoEvent, flushLogs };