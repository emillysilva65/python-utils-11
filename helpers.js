function isValidAddress(address) {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
}

function calculateGasPrice(baseGas) {
    const adjustmentFactor = 1.2;
    return Math.ceil(baseGas * adjustmentFactor);
}

function formatAmount(amount, decimals = 18) {
    return (amount / Math.pow(10, decimals)).toFixed(decimals);
}

function generateRandomHex(size) {
    return '0x' + Array.from({ length: size }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function mergeTransactions(txArray) {
    return txArray.reduce((merged, tx) => {
        const existing = merged.find(m => m.to === tx.to);
        if (existing) {
            existing.value = (parseInt(existing.value) + parseInt(tx.value)).toString();
        } else {
            merged.push(tx);
        }
        return merged;
    }, []);
}