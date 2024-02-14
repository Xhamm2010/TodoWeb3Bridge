import { ethers } from "hardhat";

async function main() {
  const todoContract = await ethers.deployContract("TodoContract");

  await todoContract.waitForDeployment();

  console.log(
    `Todo contract has been deployed to ${todoContract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});