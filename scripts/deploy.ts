import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Factory = await ethers.getContractFactory("LoanProposal");
  const loanProposal = await Factory.deploy();
  await loanProposal.waitForDeployment();

  console.log("LoanProposal deployed at:", await loanProposal.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
