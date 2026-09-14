const crypto = require('crypto');

const hashData = (data, algo = 'sha256') => {
  return crypto.createHash(algo).update(JSON.stringify(data)).digest('hex');
};

const generateNonce = (len = 16) => {
  return crypto.randomBytes(len).toString('hex');
};

const signPayload = (payload, secret) => {
  const hmac = crypto.createHmac('sha512', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('base64');
};

const secureCompare = (a, b) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

const deriveKey = (secret, salt, iterations = 10000) => {
  return crypto.pbkdf2Sync(secret, salt, iterations, 64, 'sha512');
};

module.exports = {
  hashData,
  generateNonce,
  signPayload,
  secureCompare,
  deriveKey
};