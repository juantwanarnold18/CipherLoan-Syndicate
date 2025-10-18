import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin"; // exposes `fhevm` helpers in Hardhat
import { HardhatUserConfig, vars } from "hardhat/config";
import type { NetworksUserConfig } from "hardhat/types";

// Read secrets from environment variables
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0xf99ee7f8ce3455724501172eb82ce9ce909c9c3192acc77d177f1d456f939599";

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
    },
  },
  networks,
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
export default config;
