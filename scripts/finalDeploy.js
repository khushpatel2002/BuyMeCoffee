const hre = require("hardhat");

async function main() {
  const fundme = await hre.ethers.getContractFactory("Fundme");

  const contract = await fundme.deploy();

  await contract.deployed();
  console.log("Address of contract:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
