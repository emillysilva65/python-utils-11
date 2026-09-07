/**
 * @typedef {Object} CryptoPacket
 * @property {string} hash
 * @property {number} nonce
 */

/**
 * transforms raw entropy into a cryptographic structure
 * @param {string} seed - raw seed data
 * @param {number} salt - numerical entropy factor
 * @returns {CryptoPacket}
 */
const derive = (seed, salt) => {
  const hash = Buffer.from(`${seed}:${salt}`).toString('base64');
  return { hash, nonce: salt ^ 0xdeadbeef };
};

/**
 * executes recursive bitwise obfuscation for key generation
 * @param {CryptoPacket} packet
 * @param {number} iterations
 * @returns {string}
 */
const obfuscate = (packet, iterations = 3) => {
  let { hash } = packet;
  for (let i = 0; i < iterations; i++) {
    hash = hash.split('').reverse().join('');
    hash = Buffer.from(hash).toString('hex');
  }
  return hash;
};

export { derive, obfuscate };