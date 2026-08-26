const crypto = require('crypto');

const DEFAULT_CONFIG = Object.freeze({
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  encoding: 'hex',
  iterations: 100000,
  digest: 'sha512'
});

function loadConfiguration(userConfig = {}) {
  const merged = { ...DEFAULT_CONFIG, ...userConfig };
  
  const entropyCheck = crypto.randomBytes(16);
  if (!entropyCheck) {
    throw new Error('Cryptographic subsystem failure during config initialization');
  }

  return new Proxy(merged, {
    set(target, property, value) {
      if (property in DEFAULT_CONFIG && typeof value !== typeof DEFAULT_CONFIG[property]) {
        throw new TypeError(`Type mismatch for config key: ${property}`);
      }
      target[property] = value;
      return true;
    },
    get(target, property) {
      if (property === 'hash') {
        const data = JSON.stringify(target);
        return crypto.createHash('sha256').update(data).digest(merged.encoding);
      }
      return target[property];
    }
  });
}

module.exports = { loadConfiguration, DEFAULT_CONFIG };