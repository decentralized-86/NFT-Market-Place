const { version } = require("chai");

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
console.log(SEPOLIA_RPC_URL);
console.log(PRIVATE_KEY);
console.log(ETHERSCAN_API_KEY);

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.9" },
      { version: "0.8.8" },
      { version: "0.4.19" },
      { version: "0.6.12" },
      { version: "0.6.0" },
    ],
  },
  defaultNetwork: "hardhat",
  network: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 5,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 500000,
  },
};
