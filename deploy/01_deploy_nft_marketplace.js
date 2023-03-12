const { network, deployments } = require("hardhat");
const { developmentchains } = require("../helper-hardhat.config");

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
  log("------------------------");
};
module.exports.tags = ["all", "marketplace"];
