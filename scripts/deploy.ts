// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);

  saveFrontendFiles(deployer, greeter);
}

async function saveFrontendFiles(deployer, contract) {
  const fs = require("fs");
  const artifactsDir = __dirname + "/../artifacts/contracts";
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  let addressesJson = {
    "Greeter" : {}
  };
  const addressesFile = contractsDir + "/addresses.json";
  if (fs.existsSync(addressesFile)) {
    const raw = fs.readFileSync(addressesFile);
    addressesJson = JSON.parse(raw);
  }
  const chainId = await deployer.getChainId();
  addressesJson["Greeter"]["" + chainId] = contract.address;

  fs.writeFileSync(addressesFile, JSON.stringify(addressesJson, null, 2));
  fs.copyFile(artifactsDir + "/Greeter.sol/Greeter.json", contractsDir + "/Greeter.json", (err:Error) => {
    if (err) throw err;
    console.log("Files copied!");
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
