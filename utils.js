// Function to convert a hexadecimal string to a byte array
function hexToBytes(hex) {
    if (typeof hex !== 'string') throw new TypeError('Input must be a string');
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

// Function to convert a byte array to a hexadecimal string
function bytesToHex(bytes) {
    if (!(bytes instanceof Uint8Array)) throw new TypeError('Input must be a Uint8Array');
    return Array.from(bytes).map(byte => {
        return ('0' + byte.toString(16)).slice(-2);
    }).join('');
}

/**
 * Generates a random hexadecimal string of specified length.
 * @param {number} length - Length of the string to generate.
 * @returns {string} Random hexadecimal string.
 */
function randomHex(length) {
    if (typeof length !== 'number' || length <= 0) throw new TypeError('Length must be a positive number');
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 16).toString(16);
    }
    return result;
}

/**
 * Checks if a string is a valid hexadecimal representation.
 * @param {string} hex - String to check.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidHex(hex) {
    return /^([0-9a-fA-F]{2})+$/.test(hex);
}

module.exports = { hexToBytes, bytesToHex, randomHex, isValidHex };