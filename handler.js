const crypto = require('crypto');

const VALIDATORS = Symbol('validators');

class CryptoLoopHandler {
  constructor(options = {}) {
    this.minAmount = options.minAmount || 0.0001;
    this[VALIDATORS] = [
      (tx) => (typeof tx === 'object' && tx !== null) || 'payload must be an object',
      (tx) => /^0x[a-fA-F0-9]{40}$/.test(tx.recipient) || 'invalid recipient address',
      (tx) => (typeof tx.amount === 'number' && tx.amount >= this.minAmount) || 'amount below threshold',
      (tx) => (Number.isInteger(tx.nonce) && tx.nonce >= 0) || 'invalid nonce value',
      (tx) => (typeof tx.signature === 'string' && tx.signature.length === 130) || 'malformed signature'
    ];
  }

  *processLoop(batch) {
    if (!Array.isArray(batch)) {
      throw new TypeError('Batch input must be an array of transactions');
    }

    for (const [index, rawTx] of batch.entries()) {
      const errors = [];

      for (const check of this[VALIDATORS]) {
        const result = check(rawTx);
        if (result !== true) errors.push(result);
      }

      if (errors.length > 0) {
        yield { status: 'rejected', index, tx: rawTx, reasons: errors };
        continue;
      }

      const txHash = crypto.createHash('sha256')
        .update(`${rawTx.recipient}:${rawTx.amount}:${rawTx.nonce}:${rawTx.signature}`)
        .digest('hex');

      yield {
        status: 'validated',
        index,
        hash: `0x${txHash}`,
        payload: Object.freeze({ ...rawTx, processedAt: Date.now() })
      };
    }
  }
}

module.exports = { CryptoLoopHandler };