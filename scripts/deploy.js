const hre = require("hardhat");

async function getBalances(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalance(addresses) {
  let counter = 0;
  for (const address of addresses) {
    console.log(`Address ${counter} balance:`, await getBalances(address));
    counter++;
  }
}

async function consoleMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, name ${name}, address ${from}, message ${message}`
    );
  }
}

async function main() {
  const [owner, from1,  from2, from3] = await hre.ethers.getSigners();
  const fundme = await hre.ethers.getContractFactory("Fundme");

  const contract = await fundme.deploy();

  await contract.deployed();
  console.log("Address of contract:", contract.address);

  const addresses = [owner.address, from1.address, from2.address ,from3.address];

  console.log("Before fund");

  await consoleBalance(addresses);

  const amount = { value: hre.ethers.utils.parseEther("1") };
  await contract.connect(from1).fundme("from1", "message1", amount);
  await contract.connect(from2).fundme("from2", "message2", amount);
  await contract.connect(from3).fundme("from3", "message3", amount);

  console.log("after funding");

  await consoleBalance(addresses);

  const memos = await contract.getMemos();

  consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
