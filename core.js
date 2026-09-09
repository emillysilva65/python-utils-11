const crypto = require('crypto');

const VALIDATION_RULES = {
  address: { test: (v) => typeof v === 'string' && /^0x[a-fA-F0-9]{40}$/.test(v), name: 'HEX_ADDRESS' },
  amount: { test: (v) => (typeof v === 'string' || typeof v === 'number') && /^\d+$/.test(String(v)) && BigInt(v) > 0n, name: 'POSITIVE_AMOUNT' },
  nonce: { test: (v) => Number.isInteger(v) && v >= 0, name: 'VALID_NONCE' }
};

class CryptoBatchProcessor {
  constructor(rules = VALIDATION_RULES) {
    this.rules = rules;
  }

  validateItem(item) {
    if (item === null || typeof item !== 'object') {
      return { ok: false, reason: 'Malformed object frame' };
    }
    
    return Object.entries(this.rules).reduce((acc, [field, rule]) => {
      if (!acc.ok) return acc;
      if (!rule.test(item[field])) {
        return { ok: false, reason: `Validation failed on '${field}' (${rule.name})` };
      }
      return acc;
    }, { ok: true });
  }

  *loop(items) {
    const iterable = Array.isArray(items) ? items : [items];
    for (const rawItem of iterable) {
      const validation = this.validateItem(rawItem);
      if (!validation.ok) {
        yield { status: 'INVALID', error: validation.reason, payload: rawItem };
        continue;
      }

      const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(rawItem))
        .digest('hex');

      yield {
        status: 'ACCEPTED',
        hash: `0x${hash}`,
        sender: rawItem.address,
        value: BigInt(rawItem.amount).toString()
      };
    }
  }
}

function processTransactions(txList) {
  const processor = new CryptoBatchProcessor();
  return Array.from(processor.loop(txList));
}

module.exports = { CryptoBatchProcessor, processTransactions };