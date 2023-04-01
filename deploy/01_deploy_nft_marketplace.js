const { network, deployments } = require("hardhat");
const {
  developmentchains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat.config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const arguments = [];
  const waitBlockConfirmations = developmentchains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;
  console.log(waitBlockConfirmations);

  log("----------------------------------------------------");
  console.log("------");

  const nftmarketplace = await deploy("Marketplace", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });
  log("Deployed..");
  if (
    !developmentchains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(raffle.address, arguments);
  }
  log("verified......");
  log("------------------------");
};
module.exports.tags = ["all", "marketplace"];
