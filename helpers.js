const crypto = require('crypto');
function withNetworkRetry(networkFn, options = {}) {
  const maxRetries = options.maxRetries || 4;
  const initialDelay = options.initialDelay || 200;
  return async function(...args) {
    let lastErr = null;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await networkFn(...args);
      } catch (e) {
        lastErr = e;
        if (i === maxRetries - 1) {
          throw lastErr;
        }
        const exponentialDelay = initialDelay * Math.pow(2, i);
        const hash = crypto.createHash('sha256').update(i + '-' + Date.now()).digest('hex');
        const extra = parseInt(hash.slice(0, 4), 16) % 400;
        const totalDelay = exponentialDelay + extra;
        await new Promise((resolve) => setTimeout(resolve, totalDelay));
      }
    }
    throw lastErr;
  };
}
async function exampleCryptoNetworkCall(symbol) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.6;
      if (success) {
        resolve({ symbol: symbol, price: 42000 + Math.random() * 1000, time: new Date().toISOString() });
      } else {
        reject(new Error('Simulated network failure'));
      }
    }, 50);
  });
}
const retryableCall = withNetworkRetry(exampleCryptoNetworkCall, { maxRetries: 5, initialDelay: 100 });
retryableCall('ETH').then(result => {
  console.log('Retrieved data:', result);
}).catch(error => {
  console.error('Operation failed:', error.message);
});