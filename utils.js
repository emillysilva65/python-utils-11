const crypto = require('crypto');

const FIB_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

/**
 * Executes a network operation with an entropy-infused Fibonacci backoff.
 * Uses SHA-256 hashing of the failure context to generate deterministic jitter.
 */
async function retryWithEntropy(operation, options = {}) {
  const { maxRetries = 5, baseDelayMs = 1000 } = options;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;

      const fibFactor = FIB_SEQUENCE[attempt] || FIB_SEQUENCE[FIB_SEQUENCE.length - 1];

      // Seed backoff jitter using hash of error and attempt to distribute collision probability
      const seed = `${error.message || 'network-fault'}-${attempt}`;
      const hash = crypto.createHash('sha256').update(seed).digest('hex');
      const jitterMultiplier = parseInt(hash.slice(0, 6), 16) / 0xffffff;

      // Backoff calculation with up to 50% extra entropy jitter
      const delay = baseDelayMs * fibFactor * (1 + jitterMultiplier * 0.5);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Retry limit reached (${maxRetries}). Connection aborted. Source: ${lastError.message}`);
}

module.exports = { retryWithEntropy };