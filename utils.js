const retry = async (fn, retries = 3, delay = 1000) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= retries) throw err;
      const jitter = Math.random() * 200;
      await new Promise(resolve => setTimeout(resolve, delay * attempt + jitter));
      console.warn(`crypto-op failure: attempt ${attempt} failed, retrying...`);
    }
  }
};

const withExponentialBackoff = (fn) => {
  let factor = 1;
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      factor *= 2;
      await new Promise(r => setTimeout(r, 100 * factor));
      return withExponentialBackoff(fn)(...args);
    }
  };
};

module.exports = { retry, withExponentialBackoff };