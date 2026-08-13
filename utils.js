const fetchWithRetry = async (url, options = {}, retries = 3, backoff = 300) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Fetch failed, retrying... (${retries} tries left)`);
            await new Promise(res => setTimeout(res, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        } else {
            console.error('Max retries reached. Error:', error);
            throw error;
        }
    }
};

const fetchCryptoPrice = async (crypto) => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`;
    return await fetchWithRetry(url);
};

// Example usage
// fetchCryptoPrice('bitcoin').then(data => console.log(data)).catch(err => console.error(err));