function validateCryptoInput(input) {
  if (typeof input !== 'string') return { valid: false, reason: 'must be string' };
  const trimmed = input.trim();
  if (trimmed.length === 0) return { valid: false, reason: 'empty input' };
  let isHex = true;
  for (let i = 0; i < trimmed.length; i++) {
    const charCode = trimmed.charCodeAt(i);
    if (!((charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 102) || (charCode >= 65 && charCode <= 70))) {
      isHex = false;
      break;
    }
  }
  if (!isHex) return { valid: false, reason: 'not valid hex' };
  if (trimmed.length % 2 !== 0) return { valid: false, reason: 'odd length' };
  let checksum = 0;
  for (let i = 0; i < trimmed.length; i += 2) {
    const byte = parseInt(trimmed.substr(i, 2), 16);
    checksum ^= byte;
  }
  if (checksum === 0) return { valid: false, reason: 'invalid checksum' };
  return { valid: true, data: trimmed.toLowerCase() };
}

function mainProcessingLoop(inputs) {
  const results = [];
  let index = 0;
  while (index < inputs.length) {
    const current = inputs[index];
    const validation = validateCryptoInput(current);
    if (validation.valid) {
      const processed = validation.data.split('').reverse().join('');
      results.push({ input: current, processed, status: 'success' });
    } else {
      results.push({ input: current, status: 'invalid', reason: validation.reason });
    }
    index++;
  }
  return results;
}

const sampleInputs = ['a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', 'invalid!', '1234567890abcdef1234567890abcdef', 'deadbeefdeadbeefdeadbeefdeadbeef'];
const output = mainProcessingLoop(sampleInputs);
console.log(JSON.stringify(output, null, 2));