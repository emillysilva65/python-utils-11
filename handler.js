const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retry = async (fn, options = {}) => {
  const { attempts = 3, interval = 1000, factor = 2 } = options;
  let lastError;
  let currentInterval = interval;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await delay(currentInterval);
        currentInterval *= factor;
      }
    }
  }
  throw lastError;
};

const requestHandler = async (task, config) => {
  const executor = async () => {
    const response = await task();
    if (!response.ok) throw new Error(`Crypto API failure: ${response.status}`);
    return response.json();
  };

  return retry(executor, {
    attempts: config.retries || 5,
    interval: 500,
    factor: 1.5
  });
};

module.exports = { retry, requestHandler };