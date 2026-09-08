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

const defaults = {
  rpc: 'wss://mainnet.crypto.io',
  timeout: 5000,
  retry: { attempts: 3, delay: 1000 },
  features: { validation: true, logging: false }
};

const loadConfig = (userPath) => {
  try {
    const fileContent = fs.readFileSync(path.resolve(userPath), 'utf8');
    return deepMerge(defaults, JSON.parse(fileContent));
  } catch (err) {
    return defaults;
  }
};

module.exports = { loadConfig };