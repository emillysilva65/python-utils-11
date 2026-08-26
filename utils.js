const crypto = require('crypto');

const XOR_MASK = 0xAA;

function obfuscateKey(secret) {
    const buf = Buffer.from(secret, 'utf8');
    for (let i = 0; i < buf.length; i++) {
        buf[i] = buf[i] ^ XOR_MASK;
    }
    return buf.toString('base64');
}

function clarifyKey(obfuscated) {
    const buf = Buffer.from(obfuscated, 'base64');
    for (let i = 0; i < buf.length; i++) {
        buf[i] = buf[i] ^ XOR_MASK;
    }
    return buf.toString('utf8');
}

function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

function computeChecksum(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = { obfuscateKey, clarifyKey, generateSalt, computeChecksum };