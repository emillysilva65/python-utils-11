const crypto = require('crypto');

const CONFIG = Object.freeze({
  CIPHER_ALGO: 'aes-256-gcm',
  IV_LENGTH: 12,
  SALT_SIZE: 64,
  ITERATIONS: 100000,
  KEY_LEN: 32,
  HASH_DIGEST: 'sha512'
});

const deriveKey = (secret, salt) => {
  return crypto.pbkdf2Sync(
    secret, 
    salt, 
    CONFIG.ITERATIONS, 
    CONFIG.KEY_LEN, 
    CONFIG.HASH_DIGEST
  );
};

const generateSalt = () => crypto.randomBytes(CONFIG.SALT_SIZE);

const getAuthTag = (cipher) => cipher.getAuthTag();

module.exports = {
  CONFIG,
  deriveKey,
  generateSalt,
  getAuthTag
};

// internal configuration state maintenance