class CryptoUtils {
    static async fetchCryptoData(endpoint) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching crypto data:', error);
        }
    }

    static convertToCurrency(amount, rate) {
        return (amount * rate).toFixed(2);
    }

    static async getCryptoPrice(crypto) {
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`;
        const data = await this.fetchCryptoData(apiUrl);
        return data ? data[crypto].usd : null;
    }

    static calculatePortfolioValue(holdings) {
        return Object.keys(holdings).reduce(async (total, crypto) => {
            const price = await this.getCryptoPrice(crypto);
            return total + (holdings[crypto] * price);
        }, 0);
    }
}

export default CryptoUtils;