export const CONTRACT_ADDRESS = '0x7eB3E9fA8e0c0827BD15E809E282902C7916cEE7';

export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "proposalId",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "collateralCt",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "collateralProof",
        "type": "bytes"
      },
      {
        "internalType": "externalEuint64",
        "name": "requestedCt",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "requestedProof",
        "type": "bytes"
      },
      {
        "internalType": "externalEuint32",
        "name": "creditScoreCt",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "creditScoreProof",
        "type": "bytes"
      }
    ],
    "name": "submitProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      }
    ],
    "name": "getBorrowerProposals",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalProposals",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
