/**
 * @typedef {Object} CryptoHash
 * @property {string} raw - The raw hexadecimal string
 * @property {number} entropy - Measured shannon entropy
 */

/**
 * Computes cryptographic entropy for buffer inputs
 * @param {Uint8Array} data - Input byte array
 * @returns {CryptoHash} Object containing raw hash and entropy score
 */
const computeEntropy = (data) => {
  const len = data.length;
  const freq = new Map();
  for (const byte of data) freq.set(byte, (freq.get(byte) || 0) + 1);
  
  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  const raw = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
  return { raw, entropy };
};

/**
 * Derives an obfuscated key from secret material
 * @param {string} secret - The input seed string
 * @param {number} salt - Numeric salt factor
 * @returns {string} Hexadecimal encoded obfuscated result
 */
const deriveKey = (secret, salt) => {
  const buffer = new TextEncoder().encode(secret + salt.toString());
  return buffer.reduce((acc, b) => acc ^ b, 0x5A).toString(16);
};

export { computeEntropy, deriveKey };