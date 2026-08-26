# python-utils-11

`python-utils-11` is a high-performance JavaScript library designed for real-time cryptocurrency wallet generation, address validation, and cryptographic hashing. It bridges the gap between complex blockchain protocols and everyday Node.js applications by providing lightweight, dependency-free cryptographic primitives.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D_16.0.0-blue.svg)](https://nodejs.org)

## Features

- **Multi-Chain Address Generation:** Instantly derive ECDSA keypairs and valid addresses for Bitcoin (BTC), Ethereum (ETH), and Solana (SOL) from a single master seed.
- **Strict Address Validation:** Utilize optimized regular expressions and checksum algorithms (like EIP-55 for Ethereum) to validate destination addresses before broadcasting transactions.
- **Gas & Fee Estimation Helper:** Programmatically fetch current network base fees and calculate optimal transaction gas limits based on historical mempool congestion.
- **Zero Heavy Dependencies:** Built using native Node.js `crypto` modules to ensure a minimal security footprint and fast execution times.

## Installation

Install the package locally in your Node.js project using npm or yarn:

```bash
npm install python-utils-11
```

```bash
yarn add python-utils-11
```

## Usage

Here is a quick example of how to generate a new cryptographic keypair and validate an Ethereum wallet address:

```javascript
const { WalletManager, AddressValidator } = require('python-utils-11');

// Generate a new multi-chain wallet instance
const wallet = WalletManager.generateRandomWallet();
console.log('Generated Address (ETH):', wallet.ethereum.address);
console.log('Private Key:', wallet.ethereum.privateKey);

// Validate an address with checksum verification
const targetAddress = '0x71C...3a9';
const isValid = AddressValidator.isValidEthereum(targetAddress);

if (isValid) {
  console.log('Address is valid and checksum-verified.');
} else {
  console.log('Invalid address format.');
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.