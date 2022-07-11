/* eslint-disable */
// deploy/00_deploy_conviction_voting.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const owner = process.env.DEVELOPER;
  let GTC = { address: "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F" };

  if (chainId !== "1") {
    GTC = await deploy("GTC", {
      from: deployer,
      args: [owner],
      log: true,
    });
    CGTC = await deploy("CGTC", {
      from: deployer,
      args: [owner, GTC.address],
      log: true,
    });
  }

  const ConvictionVotingContract = await deploy("ConvictionVoting", {
    from: deployer,
    args: [GTC.address, owner],
    log: true,
    waitConfirmations: 5,
  });

  console.log(
    { GTC: GTC.address },
    { CGTC: CGTC.address },
    { ConvictionVoting: ConvictionVotingContract.address }
  );

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: ConvictionVoting.address,
  //       contract: "contracts/ConvictionVoting.sol:ConvictionVoting",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["ConvictionVoting", "GTC"];
