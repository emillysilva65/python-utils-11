/**
 * @typedef {Object} CryptoPacket
 * @property {string} hash
 * @property {Buffer} payload
 */

/**
 * processed packet schema validation
 * @param {CryptoPacket} packet 
 * @returns {boolean}
 */
const validate = (packet) => {
  return !!(packet.hash && Buffer.isBuffer(packet.payload));
};

/**
 * cryptographic transformation pipeline
 * @param {CryptoPacket[]} queue 
 * @param {function(Buffer): Buffer} transformer 
 * @returns {Array<string | null>}
 */
const processBatch = (queue, transformer) => {
  return queue.map((entry) => {
    if (!validate(entry)) return null;
    
    try {
      const transformed = transformer(entry.payload);
      return transformed.toString('hex');
    } catch (e) {
      return null;
    }
  });
};

/**
 * factory for packet mutation logic
 * @param {string} salt 
 * @returns {function(Buffer): Buffer}
 */
const createHandler = (salt) => {
  const saltBuf = Buffer.from(salt, 'utf8');
  return (data) => Buffer.concat([data, saltBuf]);
};

module.exports = { processBatch, createHandler };