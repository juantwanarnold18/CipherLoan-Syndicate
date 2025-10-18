# 🔒 CipherLoan Syndicate

<div align="center">

![Zama FHE](https://img.shields.io/badge/Zama-FHE-0052FF?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Sepolia](https://img.shields.io/badge/Network-Sepolia-9cf?style=for-the-badge)

**Privacy-Preserving Loan Syndication Platform using Fully Homomorphic Encryption**

[Live Demo](https://cipherloan-syndicate.vercel.app) • [GitHub Repository](https://github.com/juantwanarnold18/CipherLoan-Syndicate) • [Contract on Etherscan](https://sepolia.etherscan.io/address/0x7eB3E9fA8e0c0827BD15E809E282902C7916cEE7)

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
- [Developer Documentation](#-developer-documentation)
- [License](#-license)

---

## 🎯 Project Overview

**CipherLoan Syndicate** is a privacy-preserving loan syndication platform demonstration built with Zama's Fully Homomorphic Encryption (FHE) technology.

### The Problem
In traditional on-chain lending systems, borrowers' sensitive financial information (collateral value, credit score, loan amount) is completely transparent, leading to:
- ❌ Privacy leakage risks
- ❌ Competitors can exploit public information
- ❌ Users lack confidence in DeFi platforms

### Our Solution
Using Zama's FHE technology to achieve:
- ✅ **End-to-End Encryption**: Data encrypted on client-side, remains encrypted on-chain
- ✅ **Encrypted Computation**: Smart contracts can verify and process proposals without decryption
- ✅ **Zero-Knowledge Proofs**: Validate encrypted data legitimacy through ZK proofs

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

## 🏗️ Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Browser                              │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  React Frontend (Vite + TypeScript)                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │ RainbowKit   │  │  Ant Design  │  │   useFHE()   │     │    │
│  │  │  (Wallet)    │  │     (UI)     │  │    Hook      │     │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                      │
│                              ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  @zama-fhe/relayer-sdk (CDN Loaded)                        │    │
│  │  • Client-side FHE Encryption                              │    │
│  │  • Generate inputProof (ZK Proof)                          │    │
│  │  • Create encrypted handles (externalEuint types)          │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Encrypted Data + Proof
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Ethereum Sepolia Testnet                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  LoanProposal.sol (@fhevm/solidity 0.8.0)                  │    │
│  │                                                             │    │
│  │  submitProposal(                                            │    │
│  │    bytes32 proposalId,                                      │    │
│  │    externalEuint64 collateralCt,    // ← bytes32 handle    │    │
│  │    bytes calldata collateralProof,  // ← ZK proof          │    │
│  │    ...                                                      │    │
│  │  )                                                          │    │
│  │  │                                                          │    │
│  │  ├─► FHE.fromExternal() ─► Validate proof                  │    │
│  │  │                     ─► Import handle to euint64         │    │
│  │  │                                                          │    │
│  │  ├─► Store encrypted data on-chain                         │    │
│  │  │   proposals[id] = Proposal({                            │    │
│  │  │     collateralEnc: euint64,                             │    │
│  │  │     requestedEnc: euint64,                              │    │
│  │  │     creditScoreEnc: euint32                             │    │
│  │  │   })                                                    │    │
│  │  │                                                          │    │
│  │  └─► FHE.allowThis() ─► Set permissions                    │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Smart Contract** | Solidity 0.8.24 | Core business logic |
| **FHE Library** | @fhevm/solidity 0.8.0 | Homomorphic encryption operations |
| **Frontend Framework** | React 18 + Vite | Modern UI development |
| **Wallet Integration** | RainbowKit + wagmi v2 | Web3 wallet connection |
| **UI Components** | Ant Design 5 | Enterprise-grade UI library |
| **FHE Client SDK** | @zama-fhe/relayer-sdk 0.2.0 | Client-side encryption |
| **Network** | Ethereum Sepolia | Testnet deployment |

---

## 🔄 How It Works

### 7-Step Encrypted Loan Submission Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│ Step 1: User Inputs Sensitive Data                                  │
│ ┌────────────────────────────────────────────────────────────┐      │
│ │  Collateral:    10000 USDT                                 │      │
│ │  Loan Amount:   50000 USDT                                 │      │
│ │  Credit Score:  750                                         │      │
│ └────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Step 2: Client-Side FHE Encryption                                  │
│ ┌────────────────────────────────────────────────────────────┐      │
│ │  const { handles, inputProof } = await encryptBatch(       │      │
│ │    contractAddress,                                        │      │
│ │    userAddress,                                            │      │
│ │    [                                                       │      │
│ │      { value: 10000n, type: 'uint64' },  // collateral    │      │
│ │      { value: 50000n, type: 'uint64' },  // amount        │      │
│ │      { value: 750, type: 'uint32' }      // credit score  │      │
│ │    ]                                                       │      │
│ │  )                                                         │      │
│ └────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Step 3: Generate Encrypted Handles + ZK Proof                       │
│ ┌────────────────────────────────────────────────────────────┐      │
│ │  handles[0]:   0xabc...123 (encrypted collateral)          │      │
│ │  handles[1]:   0xdef...456 (encrypted amount)              │      │
│ │  handles[2]:   0x789...abc (encrypted credit score)        │      │
│ │  inputProof:   0x1234...5678 (ZK proof for all)            │      │
│ └────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Step 4: Submit Transaction to Smart Contract                        │
│ ┌────────────────────────────────────────────────────────────┐      │
│ │  submitProposal(                                           │      │
│ │    proposalId,      // 0x1234...                           │      │
│ │    handles[0],      // externalEuint64 collateralCt        │      │
│ │    inputProof,      // bytes collateralProof               │      │
│ │    handles[1],      // externalEuint64 requestedCt         │      │
│ │    inputProof,      // bytes requestedProof                │      │
│ │    handles[2],      // externalEuint32 creditScoreCt       │      │
│ │    inputProof       // bytes creditScoreProof              │      │
│ │  )                                                         │      │
│ └────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Step 5: Smart Contract Validates & Imports Encrypted Data           │
│ ┌────────────────────────────────────────────────────────────┐      │
│ │  // ✅ Correct Pattern (from Sealed-Auction)               │      │
│ │  euint64 collateral = FHE.fromExternal(                    │      │
│ │    collateralCt,    // bytes32 handle                      │      │
│ │    collateralProof  // ZK proof                            │      │
│ │  );                                                        │      │
│ │                                                            │      │
│ │  // Validates:                                             │      │
│ │  // 1. Proof is valid                                      │      │
│ │  // 2. Data was encrypted for this contract                │      │
│ │  // 3. Sender is authorized                                │      │
│ └────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Step 6: Store Encrypted Data On-Chain                               │
│ ┌────────────────────────────────────────────────────────────┐      │
│ │  proposals[proposalId] = Proposal({                        │      │
│ │    proposalId: proposalId,                                 │      │
│ │    borrower: msg.sender,                                   │      │
│ │    collateralEnc: collateral,      // euint64              │      │
│ │    requestedEnc: requested,        // euint64              │      │
│ │    creditScoreEnc: creditScore,    // euint32              │      │
│ │    status: ProposalStatus.Submitted,                       │      │
│ │    submittedAt: block.timestamp                            │      │
│ │  });                                                       │      │
│ └────────────────────────────────────────────────────────────┘      │
│  ⚡ Data remains encrypted on blockchain                             │
│  🔒 No one can read the actual values                                │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Step 7: Set Access Permissions                                      │
│ ┌────────────────────────────────────────────────────────────┐      │
│ │  FHE.allowThis(collateral);      // Contract can compute   │      │
│ │  FHE.allowThis(requested);       // on encrypted data      │      │
│ │  FHE.allowThis(creditScore);     // without decrypting     │      │
│ └────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Concepts

#### 1. **externalEuint vs euint**
- `externalEuint64`: Type for receiving encrypted handles from client (alias for `bytes32`)
- `euint64`: Internal encrypted type for on-chain storage (alias for `uint256`)
- Conversion: `euint64 = FHE.fromExternal(externalEuint64, proof)`

#### 2. **FHE.fromExternal() - The Correct Pattern**
```solidity
// ✅ CORRECT: Import client-encrypted handle
euint64 value = FHE.fromExternal(encryptedHandle, proof);

// ❌ WRONG: This is for trivial encryption (plaintext)
euint64 value = TFHE.asEuint64(plaintextValue);
```

#### 3. **Zero-Knowledge Proof Validation**
- Client generates `inputProof` during encryption
- Smart contract validates proof via `FHE.fromExternal()`
- Ensures data integrity without revealing content

---

## 🧠 Smart Contract Deep Dive

### Contract Architecture

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, externalEuint64, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract LoanProposal is SepoliaConfig {

    // Encrypted data types
    struct Proposal {
        bytes32 proposalId;
        address borrower;
        euint64 collateralEnc;     // Encrypted collateral (uint256 alias)
        euint64 requestedEnc;      // Encrypted loan amount (uint256 alias)
        euint32 creditScoreEnc;    // Encrypted credit score (uint256 alias)
        ProposalStatus status;
        uint256 submittedAt;
    }

    // State management
    mapping(bytes32 => Proposal) public proposals;
    mapping(address => bytes32[]) public borrowerProposals;

    // Events
    event ProposalSubmitted(bytes32 indexed proposalId, address indexed borrower);

    // Main function
    function submitProposal(
        bytes32 proposalId,
        externalEuint64 collateralCt,      // ← bytes32 from client
        bytes calldata collateralProof,
        externalEuint64 requestedCt,
        bytes calldata requestedProof,
        externalEuint32 creditScoreCt,
        bytes calldata creditScoreProof
    ) external {
        // Import encrypted handles with proof validation
        euint64 collateral = FHE.fromExternal(collateralCt, collateralProof);
        euint64 requested = FHE.fromExternal(requestedCt, requestedProof);
        euint32 creditScore = FHE.fromExternal(creditScoreCt, creditScoreProof);

        // Store encrypted data
        proposals[proposalId] = Proposal({
            proposalId: proposalId,
            borrower: msg.sender,
            collateralEnc: collateral,
            requestedEnc: requested,
            creditScoreEnc: creditScore,
            status: ProposalStatus.Submitted,
            submittedAt: block.timestamp
        });

        // Set access permissions
        FHE.allowThis(collateral);
        FHE.allowThis(requested);
        FHE.allowThis(creditScore);

        emit ProposalSubmitted(proposalId, msg.sender);
    }
}
```

### Critical Implementation Details

#### 1. **Type System**
```solidity
// External types (from client) - bytes32 alias
externalEuint64 collateralCt      // Encrypted handle from browser
externalEuint32 creditScoreCt     // Encrypted handle from browser

// Internal types (on-chain storage) - uint256 alias
euint64 collateralEnc             // Stored encrypted value
euint32 creditScoreEnc            // Stored encrypted value
```

#### 2. **Proof Validation Flow**
```solidity
// Step 1: Receive encrypted handle + proof from client
function submitProposal(
    externalEuint64 collateralCt,     // bytes32 handle
    bytes calldata collateralProof    // ZK proof
) {
    // Step 2: Validate and import
    euint64 collateral = FHE.fromExternal(
        collateralCt,      // The encrypted handle
        collateralProof    // Validates: signature, contract address, sender
    );

    // Step 3: Store on-chain (still encrypted)
    proposals[id].collateralEnc = collateral;

    // Step 4: Set permissions for future computation
    FHE.allowThis(collateral);
}
```

#### 3. **Why FHE.fromExternal() is Critical**

**Previous Failed Approach (15 deployment failures):**
```solidity
// ❌ WRONG - Caused transaction reverts
euint64 collateral = TFHE.asEuint64(
    abi.decode(encryptedCollateral, (uint256))
);
// Problem: asEuint64() is for plaintext trivial encryption
// It doesn't validate client-provided encrypted handles
```

**Correct Approach (from Sealed-Auction reference):**
```solidity
// ✅ CORRECT - Validates and imports client-encrypted data
euint64 collateral = FHE.fromExternal(
    collateralCt,        // bytes32 handle from client
    collateralProof      // ZK proof generated during encryption
);
// Benefits:
// 1. Validates proof signature
// 2. Verifies data was encrypted for this contract
// 3. Ensures sender authorization
// 4. Properly imports handle into contract storage
```

#### 4. **Access Control Pattern**
```solidity
// Allow contract to perform computations on encrypted data
FHE.allowThis(collateral);     // Contract can use this value
FHE.allow(collateral, lender); // Specific address can decrypt

// Future use case: Compare encrypted values
function evaluateProposal(bytes32 proposalId) external {
    Proposal storage prop = proposals[proposalId];

    // Compare encrypted collateral with encrypted minimum
    ebool meetsRequirement = FHE.gte(
        prop.collateralEnc,
        minimumCollateral  // Also encrypted
    );

    // Update status based on encrypted comparison
    // No decryption needed!
}
```

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
cd CipherLoan-Syndicate
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

### Usage

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask
2. **Switch to Sepolia**: Ensure you're on Sepolia testnet
3. **Submit Proposal**: Fill in the form with:
   - Collateral amount (e.g., 10000)
   - Requested loan amount (e.g., 50000)
   - Credit score (e.g., 750)
4. **Encrypt & Submit**: Click "Submit Proposal" - data will be encrypted client-side
5. **Confirm Transaction**: Approve the MetaMask transaction
6. **View on Etherscan**: Check your transaction on Sepolia Etherscan

---

## 📁 Project Structure

```
CipherLoan-Syndicate/
├── contracts/                    # Smart contracts
│   └── LoanProposal.sol         # Main FHE contract
├── scripts/                      # Deployment scripts
│   └── deploy.ts                # Hardhat deployment script
├── frontend/                     # Frontend application
│   ├── src/
│   │   ├── config/
│   │   │   ├── wagmi.ts         # Wagmi v2 configuration
│   │   │   └── contracts.ts     # Contract address & ABI
│   │   ├── hooks/
│   │   │   └── useFHE.ts        # FHE encryption hook
│   │   ├── utils/
│   │   │   └── fhe.ts           # FHE utility functions
│   │   ├── App.tsx              # Main application component
│   │   └── main.tsx             # Application entry point
│   ├── index.html               # HTML template
│   ├── vite.config.ts           # Vite configuration
│   └── package.json             # Frontend dependencies
├── hardhat.config.ts             # Hardhat configuration
├── package.json                  # Root dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
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
| **Deployment Date** | 2025-01-18 |

**Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0x7eB3E9fA8e0c0827BD15E809E282902C7916cEE7)

### Deployment Command

```bash
DEPLOYER_PRIVATE_KEY="YOUR_PRIVATE_KEY" \
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" \
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## 🗺️ Future Roadmap

### Phase 1: MVP (✅ Completed)
- [x] Client-side FHE encryption integration
- [x] LoanProposal smart contract with FHE.fromExternal()
- [x] React frontend with wallet connection
- [x] Sepolia testnet deployment

### Phase 2: Enhanced Functionality (🚧 In Progress)
- [ ] Lender voting system on encrypted proposals
- [ ] Automatic approval based on encrypted credit score threshold
- [ ] Multi-signature approval workflow
- [ ] Encrypted interest rate negotiation

### Phase 3: Advanced Features (📋 Planned)
- [ ] Encrypted auction mechanism for loan rates
- [ ] Reputation system with encrypted scoring
- [ ] Secondary market for loan participation
- [ ] Integration with decentralized identity (DID)

### Phase 4: Production Readiness (🔮 Future)
- [ ] Security audit by third-party firm
- [ ] Mainnet deployment
- [ ] Gas optimization
- [ ] Comprehensive test coverage (>90%)
- [ ] Oracle integration for real-world data
- [ ] Mobile app (React Native)

---


## 👨‍💻 Developer Documentation

### Local Development

#### Prerequisites
- Node.js v18+
- npm v9+
- Git

#### Setup
```bash
# Clone repository
git clone https://github.com/juantwanarnold18/CipherLoan-Syndicate.git
cd CipherLoan-Syndicate

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Start local Hardhat node (optional)
npx hardhat node

# Deploy contract locally (optional)
npx hardhat run scripts/deploy.ts --network localhost

# Start frontend dev server
cd frontend && npm run dev
```

### Testing

```bash
# Run contract tests
npx hardhat test

# Run frontend in dev mode
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

### Environment Variables

Create `.env` in root directory:
```env
DEPLOYER_PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Key Files to Understand

1. **[contracts/LoanProposal.sol](contracts/LoanProposal.sol)**: Main smart contract with FHE operations
2. **[frontend/src/hooks/useFHE.ts](frontend/src/hooks/useFHE.ts)**: React hook for FHE encryption
3. **[frontend/src/App.tsx](frontend/src/App.tsx)**: Main application UI and logic
4. **[hardhat.config.ts](hardhat.config.ts)**: Hardhat network configuration

### Contributing

This is a demonstration project. For production use:
1. Complete security audit
2. Add comprehensive test coverage
3. Implement proper error handling
4. Add access control mechanisms
5. Optimize gas usage

---

## 🔐 Security Notice

⚠️ **Important Warnings**

1. **Testnet Only**: This project is for Sepolia testnet demonstration only
2. **Demo Project**: This is a proof-of-concept, not production-ready
3. **No Real Funds**: Do not use with real money or sensitive data
4. **Educational Purpose**: Built for learning FHE technology
5. **No Warranty**: Use at your own risk

### Security Considerations

- Private keys are stored in `.env` - never commit this file
- FHE encryption is computationally intensive - expect slower transaction times
- Encrypted data cannot be decrypted without proper permissions
- Always verify contract addresses before interacting

---

## 📚 References

### Zama Documentation
- [Zama Official Documentation](https://docs.zama.ai/fhevm)
- [@fhevm/solidity GitHub](https://github.com/zama-ai/fhevm)
- [Sealed-Auction Example](https://github.com/zama-ai/fhevm-hardhat-template)

### Tools & Frameworks
- [Hardhat Documentation](https://hardhat.org/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [wagmi Documentation](https://wagmi.sh/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Vite Documentation](https://vitejs.dev/)

### Learning Resources
- [FHE Explained](https://www.zama.ai/post/what-is-fully-homomorphic-encryption-fhe)
- [Ethereum Development](https://ethereum.org/en/developers/docs/)

---

## 📄 License

MIT License

Copyright (c) 2025 CipherLoan Syndicate

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">

**Built with ❤️ using Zama's FHE Technology**

⭐ If this project helps you, please give us a Star!

[GitHub](https://github.com/juantwanarnold18/CipherLoan-Syndicate) • [Report Bug](https://github.com/juantwanarnold18/CipherLoan-Syndicate/issues) • [Request Feature](https://github.com/juantwanarnold18/CipherLoan-Syndicate/issues)

</div>
