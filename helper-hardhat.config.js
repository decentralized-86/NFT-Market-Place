const networkConfig = {
  31337: {
    name: "hardhat",
  },
  5: {
    name: "goerli",
  },
  11155111: {
    name: "sepolia",
  },
};
const developmentchains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

module.exports = {
  networkConfig,
  developmentchains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
};
