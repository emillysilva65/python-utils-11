const fs = require('fs');
const path = require('path');

const deepMerge = (target, source) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return { ...target, ...source };
};

const loadCryptoConfig = (overrides = {}) => {
  const defaults = {
    network: 'mainnet',
    encryption: 'aes-256-gcm',
    timeout: 5000,
    keys: {
      path: './keys',
      rotate: true
    }
  };

  const configFile = path.resolve(process.cwd(), 'crypto.json');
  let userConfig = {};

  try {
    if (fs.existsSync(configFile)) {
      userConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    }
  } catch (e) {
    console.error('Config parsing failure, using defaults');
  }

  return deepMerge(defaults, deepMerge(userConfig, overrides));
};

module.exports = { loadCryptoConfig };