function processTransaction(transaction) {
    const validKeys = ['amount', 'currency', 'recipient'];
    for (const key of validKeys) {
        if (!transaction.hasOwnProperty(key)) {
            throw new Error(`Missing property: ${key}`);
        }
    }
    if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
        throw new Error('Invalid amount, must be a positive number.');
    }
    const validCurrencies = ['USD', 'EUR', 'BTC', 'ETH'];
    if (!validCurrencies.includes(transaction.currency)) {
        throw new Error('Unsupported currency.');
    }
    if (typeof transaction.recipient !== 'string' || transaction.recipient.trim() === '') {
        throw new Error('Invalid recipient address.');
    }
    // Process the transaction
    console.log(`Processing transaction: ${JSON.stringify(transaction)}`);
}

function mainLoop(transactions) {
    for (const tx of transactions) {
        try {
            processTransaction(tx);
        } catch (error) {
            console.error(`Error processing transaction: ${error.message}`);
        }
    }
}

const sampleTransactions = [
    { amount: 100, currency: 'USD', recipient: 'abc123' },
    { amount: -50, currency: 'EUR', recipient: 'xyz456' },
    { amount: 200, currency: 'XYZ', recipient: 'qwe789' },
    { amount: 300, currency: 'BTC', recipient: '' },
];

mainLoop(sampleTransactions);