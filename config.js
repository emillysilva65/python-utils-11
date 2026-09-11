const DEFAULT_CONFIG = Object.freeze({
  network: 'mainnet',
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
  gasLimitMultiplier: 1.15,
  maxRetries: 3,
  derivationPath: "m/44'/60'/0'/0/0",
  cacheTtlMs: 30000,
  cryptoOptions: Object.freeze({
    algorithm: 'aes-256-gcm',
    pbkdf2Iterations: 100000,
    digest: 'sha512'
  })
});

class ConfigLoader {
  constructor(customConfig = {}) {
    this._merged = this._deepMerge(DEFAULT_CONFIG, customConfig);
    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) return target[prop];
        const envKey = `CRYPTO_${String(prop).toUpperCase()}`;
        if (process.env[envKey] !== undefined) {
          return target._parseEnvValue(process.env[envKey]);
        }
        return target._merged[prop];
      }
    });
  }

  _parseEnvValue(val) {
    if (!isNaN(val) && val.trim() !== '') return Number(val);
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
    return val;
  }

  _deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else if (source[key] !== undefined) {
        result[key] = source[key];
      }
    }
    return result;
  }

  get(path) {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, this._merged);
  }

  export() {
    return JSON.parse(JSON.stringify(this._merged));
  }
}

module.exports = ConfigLoader;
