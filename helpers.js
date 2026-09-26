const crypto = require('crypto');

function* fibonacciGenerator() {
  let [a, b] = [1, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

async function executeWithEntropyRetry(fn, opts = {}) {
  const maxAttempts = opts.maxAttempts || 5;
  const baseDelayMs = opts.baseDelayMs || 250;
  const fib = fibonacciGenerator();

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn({ attempt });
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`Execution failed after ${maxAttempts} attempts: ${error.message}`);
      }

      const fibFactor = fib.next().value;
      const hashHex = crypto.createHash('sha256').update(`${attempt}:${Date.now()}`).digest('hex');
      const jitterMs = parseInt(hashHex.substring(0, 4), 16) % 100;
      const backoffDelay = (baseDelayMs * fibFactor) + jitterMs;

      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
}

async function fetchCryptoDataWithRetry(fetchFn, endpoint) {
  return executeWithEntropyRetry(async ({ attempt }) => {
    const response = await fetchFn(endpoint, {
      headers: { 'X-Retry-Attempt': attempt.toString() }
    });
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }, { maxAttempts: 4, baseDelayMs: 300 });
}

module.exports = {
  executeWithEntropyRetry,
  fetchCryptoDataWithRetry
};