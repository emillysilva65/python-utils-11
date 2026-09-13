const crypto = require('crypto');

const hexToBuffer = (hex) => Buffer.from(hex, 'hex');
const bufferToHex = (buf) => buf.toString('hex');

const xorBuffers = (a, b) => {
  const length = Math.min(a.length, b.length);
  const result = Buffer.alloc(length);
  for (let i = 0; i < length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
};

const generateIv = () => crypto.randomBytes(16);

const encryptAesGcm = (key, data, iv) => {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  return Buffer.concat([cipher.update(data, 'utf8'), cipher.final(), cipher.getAuthTag()]);
};

const decryptAesGcm = (key, encrypted, iv) => {
  const authTag = encrypted.slice(-16);
  const data = encrypted.slice(0, -16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
};

const sha256 = (input) => crypto.createHash('sha256').update(input).digest('hex');

const deriveKey = (secret, salt) => crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');

module.exports = {
  hexToBuffer,
  bufferToHex,
  xorBuffers,
  generateIv,
  encryptAesGcm,
  decryptAesGcm,
  sha256,
  deriveKey
};