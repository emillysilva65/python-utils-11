const crypto = require('crypto');

class DynamicCryptoStream {
  constructor(seed) {
    this.seed = crypto.createHash('sha256').update(String(seed)).digest();
  }

  getByteAt(index) {
    const indexBuf = Buffer.alloc(4);
    indexBuf.writeUInt32BE(index, 0);
    const hash = crypto.createHash('sha256')
      .update(Buffer.concat([this.seed, indexBuf]))
      .digest();
    return hash[0];
  }

  createMaskedView(data) {
    const source = Buffer.isBuffer(data) ? data : Buffer.from(data);
    return new Proxy(source, {
      get: (target, property) => {
        if (typeof property === 'string' && !isNaN(property)) {
          const idx = parseInt(property, 10);
          if (idx >= 0 && idx < target.length) {
            return target[idx] ^ this.getByteAt(idx);
          }
        }
        if (property === 'toHex') {
          return () => Array.from({ length: target.length }, (_, i) => 
            (target[i] ^ this.getByteAt(i)).toString(16).padStart(2, '0')
          ).join('');
        }
        const value = Reflect.get(target, property);
        return typeof value === 'function' ? value.bind(target) : value;
      }
    });
  }
}

module.exports = { DynamicCryptoStream };