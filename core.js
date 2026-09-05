const validateCryptoPayload = (data) => {
  const schema = { hash: 'string', nonce: 'number', signature: 'string' };
  return Object.entries(schema).every(([key, type]) => typeof data[key] === type);
};

const processChain = (packets) => {
  for (const packet of packets) {
    try {
      if (!validateCryptoPayload(packet)) {
        throw new Error(`Malformed segment: ${packet.id || 'unknown'}`);
      }
      const hashBuffer = Buffer.from(packet.hash, 'hex');
      if (hashBuffer.length !== 32) throw new Error('Invalid hash length');
      
      packet.processed = true;
      packet.timestamp = Date.now();
      
      console.log(`Validated segment: ${packet.hash.substring(0, 8)}`);
    } catch (err) {
      console.error(`Security violation: ${err.message}`);
      continue;
    }
  }
};

module.exports = { processChain };