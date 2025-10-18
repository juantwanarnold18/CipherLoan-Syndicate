# 🔒 CipherLoan Syndicate

<div align="center">

![Zama FHE](https://img.shields.io/badge/Zama-FHE-0052FF?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Sepolia](https://img.shields.io/badge/Network-Sepolia-9cf?style=for-the-badge)

**Privacy-Preserving Loan Syndication Platform using Fully Homomorphic Encryption**

[Live Demo](http://localhost:5173) • [Contract on Etherscan](https://sepolia.etherscan.io/address/0x7eB3E9fA8e0c0827BD15E809E282902C7916cEE7)

</div>

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Technical Architecture](#-technical-architecture)
- [How It Works](#-how-it-works)
- [Smart Contract Deep Dive](#-smart-contract-deep-dive)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Deployment Information](#-deployment-information)
- [Future Roadmap](#-future-roadmap)
- [Known Issues & Solutions](#-known-issues--solutions)
- [Developer Documentation](#-developer-documentation)
- [License](#-license)

---

## 🎯 Project Overview

**CipherLoan Syndicate** is a privacy-preserving loan syndication platform demonstration built with Zama's Fully Homomorphic Encryption (FHE) technology.

### The Problem
In traditional on-chain lending systems, borrowers' sensitive financial information (collateral value, credit score, loan amount) is completely transparent, leading to:
- Privacy leakage risks
- Competitors can exploit public information
- Users lack confidence in DeFi platforms

### Our Solution
Using Zama's FHE technology to achieve:
- **End-to-End Encryption**: Data encrypted on client-side, remains encrypted on-chain
- **Encrypted Computation**: Smart contracts can verify and process proposals without decryption
- **Zero-Knowledge Proofs**: Validate encrypted data legitimacy through ZK proofs

---

## ⚡ Core Features

### 1. 🔐 Complete Privacy Protection
- **Client-Side Encryption**: Encrypt sensitive data in browser using `@zama-fhe/relayer-sdk`
- **On-Chain Encrypted Storage**: All sensitive data stored as `euint64`/`euint32` types on blockchain
- **Access Control**: Only authorized addresses can decrypt specific data

### 2. ⛓️ Smart Contract Encrypted Computation
- **FHE Operations**: Import client-encrypted handles using `FHE.fromExternal()`
- **Homomorphic Comparison**: Contracts can compare encrypted values without decryption
- **State Management**: Proposal states fully managed on-chain (Submitted, Approved, Rejected, Funded)

### 3. 🎨 Modern Frontend
- **React 18 + Vite**: Fast development experience
- **RainbowKit**: Elegant wallet connection interface
- **Ant Design 5**: Enterprise-level UI component library
- **Responsive Design**: Mobile and desktop compatible

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask browser extension
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/juantwanarnold18/CipherLoan-Syndicate.git
cd CipherLoan-Syndicate-v2
```

#### 2. Install Dependencies

```bash
# Install root dependencies (Hardhat)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## 📁 Project Structure

```
CipherLoan-Syndicate-v2/
├── contracts/                    # Smart contracts
│   ├── LoanProposal.sol         # Main contract
│   ├── SealedAuction.sol        # Reference contract
│   └── ...
├── scripts/                      # Deployment scripts
│   └── deploy.ts                # Main deployment script
├── test/                         # Contract tests
├── frontend/                     # Frontend application
│   ├── src/
│   │   ├── config/
│   │   │   ├── wagmi.ts         # Wagmi configuration
│   │   │   └── contracts.ts     # Contract configuration
│   │   ├── hooks/
│   │   │   └── useFHE.ts        # FHE Hook
│   │   ├── utils/
│   │   │   └── fhe.ts           # FHE utility functions
│   │   ├── App.tsx              # Main application
│   │   └── main.tsx             # Entry point
│   └── vite.config.ts
├── hardhat.config.ts             # Hardhat configuration
└── README.md
```

---

## 🌐 Deployment Information

### Sepolia Testnet

| Item | Information |
|------|-------------|
| **Contract Name** | LoanProposal |
| **Contract Address** | `0x7eB3E9fA8e0c0827BD15E809E282902C7916cEE7` |
| **Network** | Sepolia Testnet |
| **Chain ID** | 11155111 |

View on Etherscan: [https://sepolia.etherscan.io/address/0x7eB3E9fA8e0c0827BD15E809E282902C7916cEE7](https://sepolia.etherscan.io/address/0x7eB3E9fA8e0c0827BD15E809E282902C7916cEE7)

---

## 🔐 Security Notice

⚠️ **Important Warnings**

1. **Testnet Only**: This project is for Sepolia testnet demonstration only
2. **Demo Project**: This is a proof-of-concept, not production-ready
3. **No Real Funds**: Do not use with real money or sensitive data

---

## 📚 References

- [Zama Official Documentation](https://docs.zama.ai/fhevm)
- [@fhevm/solidity GitHub](https://github.com/zama-ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)

---

## 📄 License

MIT License

---

<div align="center">

**Built with ❤️ using Zama's FHE Technology**

⭐ If this project helps you, please give us a Star!

</div>
