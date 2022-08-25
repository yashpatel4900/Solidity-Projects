// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// run alows us to run hardhat commands
const { ethers, run, network } = require("hardhat");

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

async function main() {
  //  // // // // Deploy the contract
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying Simple Storage Contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();

  // BUT HOW COULD IT DEPLOY WITHOUT PRIVATE KEY AND RPC URL
  //BECAUSE WE ARE USING HARDHAT NETWORK

  console.log(
    `Deployed Simple Storage Contract at address: ${simpleStorage.address}`
  );
  // Terminal command to deploy using any network - npx hardhat run scripts/deploy.js —network hardhat

  // // // // verify the contract if it is on testnet
  if (network.config.chainId === 80001 && process.env.POLYGONSCAN_API_KEY) {
    console.log("Waiting for block transactions...");
    // Wait for contract to be deployed by waiting for 6 blocks to be mined
    await simpleStorage.deployTransaction.wait(6);

    // Now use verify function declared in this script
    await verify(simpleStorage.address, []);
  }

  // // // // // Playing around Functionalities of contract
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
}

// How to verify right after deploy - 8:51:00
// Download a plugin called npm install --save-dev @nomiclabs/hardhat-etherscan
// Use this in hardhat.config.js file

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if (err.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(err);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
