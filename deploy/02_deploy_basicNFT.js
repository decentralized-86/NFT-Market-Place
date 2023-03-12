const { network } = require("hardhat");
const { developmentchains } = require("../helper-hardhat.config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  let arguments = [];
  const waitBlockConfirmations = developmentchains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;
  console.log(waitBlockConfirmations + "wow wow wow");
  const basicnft = await deploy("BasicNft", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });
  log("------------------------------------");
};
module.exports.tags = ["all", "basicnft"];
