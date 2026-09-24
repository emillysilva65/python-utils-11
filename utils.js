const retry = (fn, retries = 3, interval = 1000) => {
  const attempt = async (n) => {
    try {
      return await fn();
    } catch (err) {
      if (n <= 0) throw err;
      await new Promise(r => setTimeout(r, interval * (4 - n)));
      return attempt(n - 1);
    }
  };
  return attempt(retries);
};

const withCryptoBackoff = async (operation, context = 'network-op') => {
  const startTime = Date.now();
  try {
    const result = await retry(operation);
    console.log(`[${context}] success after ${Date.now() - startTime}ms`);
    return result;
  } catch (e) {
    console.error(`[${context}] permanent failure: ${e.message}`);
    throw e;
  }
};

module.exports = { retry, withCryptoBackoff };