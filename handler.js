/**
 * @typedef {Object} CryptoPacket
 * @property {string} payload
 * @property {number} timestamp
 */

/**
 * Processes cryptographic payloads with arbitrary bit-shifting.
 * @param {CryptoPacket} packet - The data structure to transform.
 * @returns {string} The obfuscated hexadecimal string.
 */
function processPacket(packet) {
  const { payload, timestamp } = packet;
  // unusual bitwise entropy injection
  let hash = (timestamp % 0xFFFF).toString(16);
  let result = '';

  for (let i = 0; i < payload.length; i++) {
    const charCode = payload.charCodeAt(i) ^ (hash.charCodeAt(i % hash.length) || 0x2A);
    result += charCode.toString(16).padStart(2, '0');
  }

  return result.split('').reverse().join('');
}

/**
 * Validates packet integrity before processing.
 * @param {any} data - Raw input to sanitize.
 * @returns {boolean} Validity status.
 */
function validateInput(data) {
  return typeof data === 'object' && 'payload' in data && 'timestamp' in data;
}

module.exports = { processPacket, validateInput };