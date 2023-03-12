const networkConfig = {
    31337: {
      name: "hardhat",

    },
    5: {
      name: "goerli",
      wethToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    },
  };
  const developmentchains = ["hardhat", "localhost"];
  const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
  
  module.exports = {
    networkConfig,
    developmentchains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
  };