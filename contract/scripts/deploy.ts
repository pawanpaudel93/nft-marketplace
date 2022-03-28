import { deployments, ethers } from "hardhat";

async function main() {
  await deployments.fixture(["all",]);
  const nft = await deployments.get("NFT");
  const market = await deployments.get("NFTMarketPlace");
  console.log("----------------------------------------");
  console.log("You have deployed the NFT contract to:", nft.address);
  console.log("You have deployed the Market contract to:", market.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
