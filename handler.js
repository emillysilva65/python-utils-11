// Import necessary modules
const axios = require('axios');

/**
 * Fetches the current price of a cryptocurrency.
 *
 * @param {string} symbol - The symbol of the cryptocurrency (e.g., 'BTC').
 * @returns {Promise<number>} The current price of the cryptocurrency.
 */
const fetchCryptoPrice = async (symbol) => {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    return response.data[symbol].usd;
};

/**
 * Logs the price of the cryptocurrency at a given interval.
 *
 * @param {string} symbol - The symbol of the cryptocurrency to monitor.
 * @param {number} interval - The interval in milliseconds to log the price.
 */
const logCryptoPrice = (symbol, interval) => {
    setInterval(async () => {
        try {
            const price = await fetchCryptoPrice(symbol);
            console.log(`Current price of ${symbol.toUpperCase()}: $${price}`);
        } catch (error) {
            console.error('Error fetching price:', error);
        }
    }, interval);
};

// Example usage: log the price of Bitcoin every 10 seconds
logCryptoPrice('bitcoin', 10000);
