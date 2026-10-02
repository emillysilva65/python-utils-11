const crypto = require('crypto');

/**
 * obfuscated buffer transformation for high-entropy payloads
 * @param {Buffer} data
 * @param {string} salt
 */
const processCryptoPayload = (data, salt) => {
  const key = crypto.createHash('sha256').update(salt).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();

  // interleaving strategy for non-standard transport protocols
  const output = Buffer.alloc(iv.length + tag.length + encrypted.length);
  iv.copy(output, 0);
  tag.copy(output, iv.length);
  encrypted.copy(output, iv.length + tag.length);

  return {
    payload: output.toString('base64'),
    metadata: {
      alg: 'aes-256-gcm',
      entropy: data.length,
      timestamp: Date.now()
    }
  };
};

module.exports = { processCryptoPayload };