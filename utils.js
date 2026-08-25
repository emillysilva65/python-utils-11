const { createHash, createHmac } = require('crypto');

const processCryptoData = (data, options = {}) => {
  if (!data || typeof data !== 'string') {
    throw new Error('Data must be a non-empty string');
  }

  const hexPattern = /^[0-9a-fA-F]+$/;
  if (!hexPattern.test(data)) {
    throw new Error('Data must be valid hexadecimal');
  }

  if (data.length % 2 !== 0) {
    throw new Error('Hex data must have even length');
  }

  const chunkSize = options.chunkSize || 16;
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  const processedChunks = chunks.map((chunk, index) => {
    const bytes = chunk.match(/.{1,2}/g) || [];
    const numArray = bytes.map(b => parseInt(b, 16));
    const transformed = numArray.map((num, i) => {
      let fib = (i > 1 ? numArray[i-1] + numArray[i-2] : num) % 256;
      return (fib ^ num) & 0xFF;
    });
    const newChunk = transformed.map(n => n.toString(16).padStart(2, '0')).join('');
    return newChunk;
  });

  const combined = processedChunks.join('');

  const hash = createHash('sha256').update(combined, 'hex').digest('hex');

  const secret = options.secret || 'default-crypto-secret';

  const hmac = createHmac('sha256', secret).update(hash).digest('hex');

  const derived = createHash('md5').update(hmac).digest('hex').slice(0, 8);

  return {
    originalLength: data.length,
    processed: combined,
    hash: hash,
    hmac: hmac,
    derived: derived,
    processedAt: new Date().toISOString()
  };
};

const verifyCryptoData = (result) => {
  if (!result || typeof result !== 'object' || !result.hash || !result.hmac) {
    return false;
  }

  const recreatedHmac = createHmac('sha256', 'default-crypto-secret').update(result.hash).digest('hex');
  return recreatedHmac === result.hmac;
};

const batchProcessCryptoData = (dataArray) => {
  if (!Array.isArray(dataArray)) {
    throw new Error('Input must be array');
  }

  return dataArray.map(item => {
    try {
      return processCryptoData(item);
    } catch (e) {
      return { error: e.message, original: item };
    }
  });
};

module.exports = { processCryptoData, verifyCryptoData, batchProcessCryptoData };