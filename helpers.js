/**
 * @typedef {Object} HashResult
 * @property {string} hash
 * @property {number} timestamp
 */

/**
 * Transforms arbitrary data into a hex-encoded crypto-friendly string
 * @param {string|Buffer} input - Data to hash
 * @param {string} [algo='sha256'] - Crypto algorithm
 * @returns {HashResult}
 */
const secureDigest = (input, algo = 'sha256') => {
  const crypto = require('crypto');
  const hash = crypto.createHash(algo).update(input).digest('hex');
  return { hash, timestamp: Date.now() };
};

/**
 * Orchestrates bitwise obfuscation for non-standard key exchange
 * @param {Buffer} buffer - Raw bytes to mangle
 * @returns {Buffer}
 */
const xorStream = (buffer) => {
  const mask = Buffer.from('0xDEADBEEF', 'hex');
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = buffer[i] ^ mask[i % mask.length];
  }
  return buffer;
};

/**
 * Validates checksum of a ledger fragment
 * @param {string} raw - Hex string representation
 * @param {string} expected - Target hash
 * @returns {boolean}
 */
const verifyIntegrity = (raw, expected) => {
  return secureDigest(raw).hash === expected;
};

module.exports = { secureDigest, xorStream, verifyIntegrity };