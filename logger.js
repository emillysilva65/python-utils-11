const crypto = require('crypto');

/**
 * @typedef {Object} LogEntry
 * @property {string} id
 * @property {string} timestamp
 * @property {string} operation
 * @property {string} payloadHash
 * @property {string} signature
 */

/**
 * Secure logger for crypto operations with hash chaining for integrity.
 * @class
 */
class CryptoLogger {
  /**
   * Initialize the logger with a secret key.
   * @param {string} secret - Secret for HMAC signatures
   */
  constructor(secret) {
    this.secret = secret;
    this.logs = [];
    this.chain = crypto.createHash('sha256').update(secret).digest('hex');
  }

  /**
   * Log a cryptographic operation.
   * @param {string} operation - Type of crypto op
   * @param {Object} data - Operation data
   * @returns {LogEntry}
   */
  log(operation, data) {
    const timestamp = new Date().toISOString();
    const dataStr = JSON.stringify(data);
    const payloadHash = crypto.createHash('sha256').update(dataStr).digest('hex');
    const combined = this.chain + payloadHash + timestamp + operation;
    const signature = crypto.createHmac('sha256', this.secret).update(combined).digest('hex');
    this.chain = crypto.createHash('sha256').update(combined).digest('hex');
    const entry = {
      id: crypto.randomBytes(16).toString('hex'),
      timestamp: timestamp,
      operation: operation,
      payloadHash: payloadHash,
      signature: signature
    };
    this.logs.push(entry);
    console.log(`[CRYPTO] ${operation} @ ${timestamp} - ${payloadHash.slice(0, 10)}`);
    return entry;
  }

  /**
   * Verify log chain integrity.
   * @returns {boolean}
   */
  verify() {
    let currentChain = crypto.createHash('sha256').update(this.secret).digest('hex');
    for (let i = 0; i < this.logs.length; i++) {
      const entry = this.logs[i];
      const combined = currentChain + entry.payloadHash + entry.timestamp + entry.operation;
      const expected = crypto.createHmac('sha256', this.secret).update(combined).digest('hex');
      if (expected !== entry.signature) {
        return false;
      }
      currentChain = crypto.createHash('sha256').update(combined).digest('hex');
    }
    return true;
  }

  /**
   * Retrieve all logged entries.
   * @returns {LogEntry[]}
   */
  getLogs() {
    return this.logs.slice();
  }
}

module.exports = CryptoLogger;