function isValidAddress(address) {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
}

function isValidAmount(amount) {
    return typeof amount === 'number' && amount > 0;
}

function processTransaction(address, amount) {
    if (!isValidAddress(address)) {
        throw new Error('Invalid address format');
    }
    if (!isValidAmount(amount)) {
        throw new Error('Invalid amount');
    }
    // Main processing logic here
    console.log(`Processing transaction to ${address} for amount ${amount}`);
}

const transactions = [
    { address: '0x1234567890abcdef1234567890abcdef12345678', amount: 10 },
    { address: 'invalid_address', amount: 5 },
    { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef', amount: -20 }
];

transactions.forEach(tx => {
    try {
        processTransaction(tx.address, tx.amount);
    } catch (error) {
        console.error(`Failed to process transaction: ${error.message}`);
    }
});