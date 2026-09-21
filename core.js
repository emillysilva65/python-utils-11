class FastCryptoCache {
  constructor(size = 4096) {
    this.size = size;
    this.mask = size - 1;
    this.keys = new Uint32Array(size);
    this.values = new BigUint64Array(size);
  }

  hash(key) {
    let h = Number(key & 0xffffffffn);
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h & this.mask;
  }

  get(key) {
    const idx = this.hash(key);
    const lowKey = Number(key & 0xffffffffn);
    return this.keys[idx] === lowKey ? this.values[idx] : null;
  }

  set(key, val) {
    const idx = this.hash(key);
    this.keys[idx] = Number(key & 0xffffffffn);
    this.values[idx] = val;
  }
}

const cache = new FastCryptoCache();

export function optimizedModPow(base, exp, mod) {
  if (mod === 1n) return 0n;
  const cacheKey = (base ^ (exp << 16n) ^ (mod << 32n)) & 0xffffffffn;
  const cached = cache.get(cacheKey);
  if (cached !== null) return cached;

  let result = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e % 2n === 1n) result = (result * b) % mod;
    e >>= 1n;
    b = (b * b) % mod;
  }

  cache.set(cacheKey, result);
  return result;
}