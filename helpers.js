const { createHash, randomBytes } = require('crypto');

class CryptoPipeline {
  constructor(data = Buffer.alloc(0)) {
    this.buffer = Buffer.isBuffer(data) ? data : Buffer.from(String(data));
  }

  static from(input) {
    return new CryptoPipeline(input);
  }

  hash256() {
    const h1 = createHash('sha256').update(this.buffer).digest();
    this.buffer = createHash('sha256').update(h1).digest();
    return this;
  }

  ripemd160() {
    this.buffer = createHash('ripemd160').update(this.buffer).digest();
    return this;
  }

  reverseEndian() {
    this.buffer = Buffer.from(this.buffer).reverse();
    return this;
  }

  padPKCS7(blockSize = 16) {
    const padding = blockSize - (this.buffer.length % blockSize);
    const padBuf = Buffer.alloc(padding, padding);
    this.buffer = Buffer.concat([this.buffer, padBuf]);
    return this;
  }

  to(format) {
    switch (format.toLowerCase()) {
      case 'hex': return this.buffer.toString('hex');
      case 'base64': return this.buffer.toString('base64');
      case 'buffer': return Buffer.from(this.buffer);
      case 'array': return Array.from(this.buffer);
      case 'int': return BigInt('0x' + (this.buffer.toString('hex') || '0'));
      default: throw new Error(`Unsupported format: ${format}`);
    }
  }
}

const helpers = new Proxy({}, {
  get(_, prop) {
    if (prop === 'pipeline') return (data) => CryptoPipeline.from(data);
    if (prop === 'nonce') return (len = 16) => randomBytes(len).toString('hex');
    
    return (input, ...args) => {
      const pipe = CryptoPipeline.from(input);
      if (typeof pipe[prop] === 'function') {
        const res = pipe[prop](...args);
        return res instanceof CryptoPipeline ? res.to('hex') : res;
      }
      return pipe.to(prop);
    };
  }
});

module.exports = { CryptoPipeline, helpers };