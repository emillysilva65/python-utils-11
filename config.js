// Configuration for crypto utilities

/**
 * Stores configuration settings for the crypto application.
 * @typedef {Object} Config
 * @property {string} apiUrl - The base API URL for cryptocurrency data.
 * @property {string} apiKey - The API key for authentication.
 * @property {number} refreshRate - The rate (in milliseconds) to refresh data.
 */

/**
 * @type {Config}
 */
const config = {
    apiUrl: 'https://api.crypto.example.com',
    apiKey: 'your-api-key',
    refreshRate: 60000 // 1 minute
};

/**
 * Get configuration setting.
 * @param {keyof Config} key - The configuration key to retrieve.
 * @returns {string | number} - The value of the configuration key.
 */
function getConfig(key) {
    return config[key];
}

/**
 * Set configuration setting.
 * @param {keyof Config} key - The configuration key to set.
 * @param {string | number} value - The value to set for the configuration key.
 */
function setConfig(key, value) {
    config[key] = value;
}

export { getConfig, setConfig };