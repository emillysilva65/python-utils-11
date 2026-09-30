class PythonicBytes {
  constructor(arrayBuffer) {
    this.bytes = new Uint8Array(arrayBuffer);
  }

  get proxy() {
    return new Proxy(this.bytes, {
      get: (target, prop) => {
        if (typeof prop === 'string' && prop.includes(':')) {
          const parts = prop.split(':').map(x => x === '' ? undefined : parseInt(x, 10));
          const start = parts[0] !== undefined ? (parts[0] < 0 ? target.length + parts[0] : parts[0]) : 0;
          const end = parts[1] !== undefined ? (parts[1] < 0 ? target.length + parts[1] : parts[1]) : target.length;
          return target.slice(start, end);
        }
        const index = Number(prop);
        if (!isNaN(index)) {
          const actualIndex = index < 0 ? target.length + index : index;
          return target[actualIndex];
        }
        return target[prop];
      }
    });
  }

  toHex() {
    return Array.from(this.bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static fromHex(hexString) {
    const clean = hexString.replace(/^0x/, '');
    const matches = clean.match(/.{1,2}/g) || [];
    return new PythonicBytes(new Uint8Array(matches.map(byte => parseInt(byte, 16))));
  }

  xor(other) {
    const otherBytes = other instanceof PythonicBytes ? other.bytes : new Uint8Array(other);
    const result = new Uint8Array(this.bytes.length);
    for (let i = 0; i < this.bytes.length; i++) {
      result[i] = this.bytes[i] ^ (otherBytes[i % otherBytes.length] || 0);
    }
    return new PythonicBytes(result);
  }
}

module.exports = { PythonicBytes };