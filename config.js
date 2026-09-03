const DEFAULTS = {
  RPC_URL: 'https://cloudflare-eth.com',
  GAS_LIMIT: 21000,
  NETWORK: 'mainnet',
  SECRET_KEY_B64: 'ZGVmYXVsdF9jcnlwdG9fa2V5XzMyX2J5dGVzX2xvbmc='
};

class ConfigLoader {
  constructor(customConfig = {}) {
    this.rawConfig = { ...DEFAULTS, ...customConfig, ...this._loadFromEnv() };
  }

  _loadFromEnv() {
    const envConfig = {};
    if (typeof process !== 'undefined' && process.env) {
      for (const [key, value] of Object.entries(process.env)) {
        if (key in DEFAULTS || key.startsWith('CRYPTO_')) {
          envConfig[key] = value;
        }
      }
    }
    return envConfig;
  }

  get(key) {
    const value = this.rawConfig[key];
    if (value === undefined) return undefined;

    if (typeof value === 'string' && key.endsWith('_B64')) {
      try {
        return Buffer.from(value, 'base64').toString('utf8');
      } catch (e) {
        return value;
      }
    }

    if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
      return Number(value);
    }

    return value;
  }

  buildProxy() {
    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === 'symbol') return undefined;
        if (prop in target && typeof target[prop] === 'function') {
          return target[prop].bind(target);
        }
        return target.get(prop);
      }
    });
  }
}

module.exports = new ConfigLoader().buildProxy();