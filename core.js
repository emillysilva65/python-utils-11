class CryptoUtils {
    constructor() {
        this.cache = {};
    }

    fetchPrice(symbol) {
        if (this.cache[symbol]) {
            return Promise.resolve(this.cache[symbol]);
        }
        return this.queryPrice(symbol).then(price => {
            this.cache[symbol] = price;
            return price;
        });
    }

    async queryPrice(symbol) {
        const response = await fetch(`https://api.crypto.com/v1/price/${symbol}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.price;
    }

    clearCache() {
        this.cache = {};
    }
}

const cryptoUtils = new CryptoUtils();

export default cryptoUtils;