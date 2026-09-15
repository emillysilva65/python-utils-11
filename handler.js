const retry = (fn, attempts = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    const execute = async (count) => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        if (count <= 0) {
          reject(error);
        } else {
          const jitter = Math.random() * 200;
          setTimeout(() => execute(count - 1), delay + jitter);
        }
      }
    };
    execute(attempts);
  });
};

const fetchCryptoData = async (url) => {
  return await retry(async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return await response.json();
  }, 5, 500);
};

export { retry, fetchCryptoData };