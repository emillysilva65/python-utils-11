const cryptoConfig = {
  version: '1.0.0',
  algorithms: {
    hash: 'simulated-sha256',
    cipher: 'xor'
  },
  lengths: {
    key: 32,
    salt: 16
  }
};

function validateConfig() {
  if (cryptoConfig.lengths.key < 16) {
    throw new Error('Key too short');
  }
  return cryptoConfig;
}

function generateSalt() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  for (let i = 0; i < cryptoConfig.lengths.salt; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
}

function deriveKey(password, salt) {
  let key = [];
  const combined = password + salt;
  for (let i = 0; i < cryptoConfig.lengths.key; i++) {
    let val = combined.charCodeAt(i % combined.length);
    val = ((val * 31) + i) % 256;
    key.push(val);
  }
  return key;
}

function encrypt(text, password) {
  const cfg = validateConfig();
  const salt = generateSalt();
  const key = deriveKey(password, salt);
  let encrypted = '';
  for (let i = 0; i < text.length; i++) {
    const t = text.charCodeAt(i);
    const k = key[i % key.length];
    encrypted += String.fromCharCode(t ^ k);
  }
  return btoa(salt + encrypted);
}

function decrypt(encrypted, password) {
  const cfg = validateConfig();
  const combined = atob(encrypted);
  const salt = combined.slice(0, cryptoConfig.lengths.salt);
  const encText = combined.slice(cryptoConfig.lengths.salt);
  const key = deriveKey(password, salt);
  let decrypted = '';
  for (let i = 0; i < encText.length; i++) {
    const e = encText.charCodeAt(i);
    const k = key[i % key.length];
    decrypted += String.fromCharCode(e ^ k);
  }
  return decrypted;
}

module.exports = {
  cryptoConfig,
  encrypt,
  decrypt,
  deriveKey,
  generateSalt
};