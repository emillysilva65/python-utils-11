const crypto = require('crypto');

const robustEncrypt = (data, key) => {
  try {
    if (!key || key.length !== 32) throw new Error('ERR_INVALID_KEY_LENGTH');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { payload: encrypted, iv: iv.toString('hex') };
  } catch (e) {
    return { error: true, code: e.message || 'ERR_ENCRYPTION_FAILED', timestamp: Date.now() };
  }
};

const safeHash = (input) => {
  const sensitive = typeof input === 'object' ? JSON.stringify(input) : String(input);
  return crypto.createHash('sha256').update(sensitive).digest('hex');
};

const validatePayload = (obj) => {
  const checks = ['payload', 'iv'];
  const keys = Object.keys(obj);
  const missing = checks.filter(k => !keys.includes(k));
  
  if (missing.length > 0) {
    console.error(`Missing keys: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

module.exports = { robustEncrypt, safeHash, validatePayload };