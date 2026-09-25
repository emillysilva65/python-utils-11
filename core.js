const validateInput = (data) => {
  const schema = { hash: 'string', nonce: 'number' };
  return Object.keys(schema).every(k => typeof data[k] === schema[k]);
};

const processCryptoPayloads = (queue) => {
  const results = [];
  for (const entry of queue) {
    try {
      if (!validateInput(entry)) {
        throw new Error(`Malformed payload: ${JSON.stringify(entry)}`);
      }
      const hashDigest = Buffer.from(entry.hash, 'hex');
      const combined = Buffer.concat([hashDigest, Buffer.from(entry.nonce.toString())]);
      results.push(combined.toString('base64'));
    } catch (e) {
      console.error(`Skipping invalid frame: ${e.message}`);
      continue;
    }
  }
  return results;
};

module.exports = { processCryptoPayloads };