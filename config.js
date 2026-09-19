/**
 * @typedef {Object} CryptoConfig
 * @property {string} cipher - The hashing algorithm identifier
 * @property {number} rounds - Iteration count for derivation
 * @property {boolean} salt - Enable cryptographic salt usage
 */

/**
 * @type {CryptoConfig}
 */
const config = {
  cipher: 'sha256',
  rounds: 10000,
  salt: true
};

/**
 * Retrieves a specific configuration parameter with fallback
 * @param {keyof CryptoConfig} key - Configuration key to retrieve
 * @returns {string|number|boolean} The requested configuration value
 */
function getConfig(key) {
  const value = config[key];
  return value !== undefined ? value : null;
}

/**
 * Updates internal crypto configuration state
 * @param {Partial<CryptoConfig>} settings - Partial object to overwrite
 * @returns {void}
 */
function updateConfig(settings) {
  Object.keys(settings).forEach(k => {
    if (k in config) config[k] = settings[k];
  });
}

export { config, getConfig, updateConfig };