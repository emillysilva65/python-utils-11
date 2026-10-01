const validateCryptoInput = (input) => {
  const hexRegex = /^[0-9a-fA-F]+$/;
  const isBuffer = Buffer.isBuffer(input);
  const isHexString = typeof input === 'string' && hexRegex.test(input) && input.length % 2 === 0;
  return isBuffer || isHexString;
};

const processCryptoBatch = (batch) => {
  const validated = [];
  for (const entry of batch) {
    try {
      if (!validateCryptoInput(entry)) {
        console.error(`[SecurityWarn] malformed payload dropped: ${typeof entry}`);
        continue;
      }
      validated.push(entry);
    } catch (err) {
      console.warn('stream processing interruption', err.message);
    }
  }
  return validated;
};

module.exports = { validateCryptoInput, processCryptoBatch };