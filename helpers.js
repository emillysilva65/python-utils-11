/**
 * @typedef {Object} CryptoPair
 * @property {string} base
 * @property {string} quote
 */

/**
 * Normalizes crypto pair strings into a structured object
 * @param {string} pair - The market pair string (e.g. BTC_USD)
 * @returns {CryptoPair}
 */
const parsePair = (pair) => {
  const [base, quote] = pair.split('_');
  return { base: base.toUpperCase(), quote: quote.toUpperCase() };
};

/**
 * Calculates a simple checksum for data validation
 * @param {string|Buffer} data
 * @returns {number}
 */
const checksum = (data) => {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  let sum = 0;
  for (const byte of buf) {
    sum = (sum + byte) % 65535;
  }
  return sum;
};

/**
 * Generates a non-cryptographic unique identifier
 * @returns {string}
 */
const generateNonce = () => {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

module.exports = {
  parsePair,
  checksum,
  generateNonce
};