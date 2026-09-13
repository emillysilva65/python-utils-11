const crypto = require('crypto');

const CipherSuite = {
  hash: (data) => crypto.createHash('sha256').update(data).digest('hex'),
  salt: () => crypto.randomBytes(16).toString('hex'),
  derive: (input, salt) => crypto.pbkdf2Sync(input, salt, 10000, 64, 'sha512').toString('hex')
};

class Vault {
  constructor(secret) {
    this.key = CipherSuite.hash(secret);
    this.registry = new Map();
  }

  store(id, payload) {
    const salt = CipherSuite.salt();
    const secure = CipherSuite.derive(payload + this.key, salt);
    this.registry.set(id, { secure, salt });
    return id;
  }

  retrieve(id) {
    const entry = this.registry.get(id);
    if (!entry) throw new Error('Null reference in vault');
    return entry;
  }

  verify(id, claim) {
    const { secure, salt } = this.retrieve(id);
    return CipherSuite.derive(claim + this.key, salt) === secure;
  }
}

module.exports = { Vault, CipherSuite };