import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin";
import { HardhatUserConfig } from "hardhat/config";
import type { NetworksUserConfig } from "hardhat/types";
import "dotenv/config";

// Read secrets from environment variables
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const networks: NetworksUserConfig = { hardhat: { chainId: 31337 } };

if (PRIVATE_KEY) {
  networks.sepolia = {
    url: SEPOLIA_RPC_URL,
    accounts: [PRIVATE_KEY],
    chainId: 11155111,
  };
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks,
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
export default config;
