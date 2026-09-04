const crypto = require('crypto');

const handleCryptoEdgeCases = (data, context = 'default') => {
  try {
    if (typeof data === 'undefined' || data === null) {
      throw new Error('NULL_INPUT_DETECTED');
    }

    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(String(data));

    if (buffer.length === 0) {
      return { error: 'EMPTY_BUFFER', context };
    }

    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return { success: true, hash, timestamp: Date.now() };

  } catch (err) {
    return {
      success: false,
      reason: err.message,
      remediation: 'verify_input_integrity',
      trace: crypto.randomBytes(4).toString('hex')
    };
  }
};

const safeDecrypt = (payload, secret) => {
  if (!secret || secret.length < 32) {
    return { status: 'INSECURE_KEY', code: 403 };
  }

  try {
    const [iv, encrypted] = payload.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return { data: decrypted };
  } catch (e) {
    return { status: 'DECRYPTION_FAILURE', detail: 'invalid_padding_or_key' };
  }
};

module.exports = { handleCryptoEdgeCases, safeDecrypt };