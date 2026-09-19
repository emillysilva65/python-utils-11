const crypto = require('crypto');

const ENV_VARS = {
  SECRET_KEY: process.env.SECRET_KEY || 'default-fallback-entropy-32-bytes',
  ALGORITHM: 'aes-256-gcm',
  IV_LENGTH: 12,
  TAG_LENGTH: 16
};

const deriveKey = (secret) => {
  return crypto.createHash('sha256').update(String(secret)).digest();
};

class CryptoConfig {
  constructor(secret) {
    this.key = deriveKey(secret || ENV_VARS.SECRET_KEY);
    this.algo = ENV_VARS.ALGORITHM;
  }

  get cipherParams() {
    return {
      algorithm: this.algo,
      key: this.key,
      ivLen: ENV_VARS.IV_LENGTH,
      tagLen: ENV_VARS.TAG_LENGTH
    };
  }
}

module.exports = {
  CryptoConfig,
  ENV_VARS
};