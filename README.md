# python-utils-11

A robust JavaScript toolkit for blockchain data processing and cryptocurrency market analysis. This library streamlines interaction with decentralized exchanges and provides high-performance utilities for crypto asset tracking.

## Features

*   **Price Feed Aggregation:** Synchronous fetching of live ticker data from major CEX/DEX APIs with automatic fallback handling.
*   **Wallet Analytics:** Lightweight module to parse transaction history and calculate net realized gains across multiple token standards.
*   **Precision Math Utilities:** Handles floating-point arithmetic for ERC-20 token decimals to prevent rounding errors in swap calculations.
*   **Signature Verification:** Streamlined implementation of EIP-712 typed data signing and address recovery for secure dApp authentication.

## Installation

Install the package via npm:

```bash
npm install python-utils-11
```

Or via yarn:

```bash
yarn add python-utils-11
```

## Usage

Quickly retrieve market data or perform wallet calculations in your project:

```javascript
const { CryptoClient, MathUtils } = require('python-utils-11');

// Initialize client
const client = new CryptoClient({ apiKey: 'YOUR_API_KEY' });

// Fetch latest price
client.getTicker('BTC-USDT').then(data => {
  console.log(`Current price: ${data.lastPrice}`);
});

// Calculate token units safely
const safeBalance = MathUtils.toHumanReadable('1000000000000000000', 18);
console.log(`Wallet Balance: ${safeBalance} ETH`);
```

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.