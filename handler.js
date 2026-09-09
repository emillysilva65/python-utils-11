const retry = (fn, attempts = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    const attempt = async (count) => {
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        if (count <= 1) {
          reject(err);
        } else {
          const jitter = Math.random() * 200;
          setTimeout(() => attempt(count - 1), delay + jitter);
        }
      }
    };
    attempt(attempts);
  });
};

const secureFetch = async (url, options = {}) => {
  return retry(async () => {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }, 5, 500);
};

module.exports = { retry, secureFetch };