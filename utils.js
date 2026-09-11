const crypto = require('crypto');

const robustEncrypt = (data, key) => {
  try {
    if (typeof data !== 'string') throw new TypeError('Payload must be string');
    if (!key || key.length < 32) throw new Error('Insufficient key entropy');

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return { 
      iv: iv.toString('hex'), 
      tag: cipher.getAuthTag().toString('hex'), 
      data: encrypted 
    };
  } catch (err) {
    return { error: 'encryption_failure', detail: err.message, timestamp: Date.now() };
  }
};

const safeDecrypt = (bundle, key) => {
  try {
    if (!bundle.iv || !bundle.tag || !bundle.data) return null;
    
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm', 
      Buffer.from(key), 
      Buffer.from(bundle.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(bundle.tag, 'hex'));
    
    let decrypted = decipher.update(bundle.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (e) {
    console.error('Decryption integrity breach:', e.message);
    return null;
  }
};

module.exports = { robustEncrypt, safeDecrypt };