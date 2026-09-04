# python-utils-11

A robust suite of JavaScript utilities designed to streamline cryptographic operations and blockchain data parsing. This library simplifies complex hashing, signature verification, and wallet address validation for decentralized applications.

## Features

*   **ECDSA Signature Verification:** Native support for SECP256k1 signature recovery and validation, essential for EVM-based transaction signing.
*   **Keccak-256 Hashing:** High-performance implementation of Keccak-256, optimized for efficient data indexing and address generation.
*   **BIP-39 Mnemonic Helper:** Tools to generate, validate, and derive private keys from standard mnemonic phrases.
*   **Checksum Validator:** Built-in utilities to ensure Ethereum address checksum compliance (EIP-55) before broadcasting transactions.

## Installation

Install the package via npm:

```bash
npm install python-utils-11
```

Or using yarn:

```bash
yarn add python-utils-11
```

## Usage

```javascript
const { hashMessage, isValidAddress } = require('python-utils-11');

// Validate an Ethereum address
const address = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
console.log(isValidAddress(address)); // true

// Generate a Keccak-256 hash
const hash = hashMessage('hello crypto');
console.log(hash); 
// 0x...
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.