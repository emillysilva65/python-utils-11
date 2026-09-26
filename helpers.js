const crypto = require('crypto');

const PIPELINE_TRANSFORMS = Symbol('PIPELINE_TRANSFORMS');

class CryptoPipeline {
    constructor(initialValue) {
        this.val = initialValue;
        this[PIPELINE_TRANSFORMS] = [];

        return new Proxy(this, {
            get(target, prop) {
                if (prop in target) return target[prop];
                if (typeof CryptoHelpers[prop] === 'function') {
                    return (...args) => {
                        target.val = CryptoHelpers[prop](target.val, ...args);
                        target[PIPELINE_TRANSFORMS].push(prop);
                        return this;
                    };
                }
            }
        });
    }

    unwrap() {
        return this.val;
    }

    audit() {
        return {
            result: this.val,
            history: [...this[PIPELINE_TRANSFORMS]]
        };
    }
}

const CryptoHelpers = {
    toHex(data) {
        if (Buffer.isBuffer(data)) return data.toString('hex');
        return Buffer.from(String(data), 'utf8').toString('hex');
    },

    sha256(hexOrStr) {
        const isHex = typeof hexOrStr === 'string' && /^[0-9a-fA-F]+$/.test(hexOrStr) && hexOrStr.length % 2 === 0;
        const buf = isHex ? Buffer.from(hexOrStr, 'hex') : Buffer.from(String(hexOrStr));
        return crypto.createHash('sha256').update(buf).digest('hex');
    },

    ripemd160(hexStr) {
        const buf = Buffer.from(String(hexStr), 'hex');
        return crypto.createHash('ripemd160').update(buf).digest('hex');
    },

    padKey(hexStr, length = 64) {
        return String(hexStr).padStart(length, '0').slice(-length);
    },

    obfuscateAddress(addr) {
        const str = String(addr);
        if (str.length <= 10) return str;
        return `${str.slice(0, 6)}...${str.slice(-4)}`;
    }
};

const pipe = (val) => new CryptoPipeline(val);

module.exports = {
    pipe,
    ...CryptoHelpers
};