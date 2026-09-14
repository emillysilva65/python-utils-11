# python-utils-11

A robust toolkit designed to streamline crypto-asset management and blockchain data interactions. This library provides high-performance utilities for address validation, unit conversions, and secure transaction signing in JavaScript environments.

## Features

*   **Address Validator:** High-speed checksum verification and format validation for Ethereum (EIP-55) and Bitcoin (Bech32) addresses.
*   **Precision Unit Converter:** Native BigInt support for safe conversions between Wei, Gwei, and Ether to prevent floating-point calculation errors.
*   **Transaction Signer:** Lightweight utility for generating deterministic ECDSA signatures and managing cryptographic key pairs.
*   **Rate-Limited API Wrapper:** Built-in concurrency control for querying major exchange pricing endpoints without triggering rate-limit bans.

## Installation

Install the package via npm:

```bash
npm install python-utils-11
```

Or via yarn:

```bash
yarn add python-utils-11
```

## Basic Usage

```javascript
const { CryptoUtils, UnitConverter } = require('python-utils-11');

// Validate an Ethereum address
const isValid = CryptoUtils.isValidAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');

// Convert 1.5 ETH to Wei
const weiAmount = UnitConverter.toWei('1.5', 'ether');

console.log(`Address Valid: ${isValid}`);
console.log(`Amount in Wei: ${weiAmount.toString()}`);
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Distributed under the MIT License. See `LICENSE` for more information.