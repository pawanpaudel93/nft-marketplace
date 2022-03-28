import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { BigNumber, Contract } from "ethers";


describe("NFTMarket", function () {
  let nft: Contract;
  let market: Contract;

  beforeEach(async function () {
    await deployments.fixture(["all",]);
    const { deployer } = await getNamedAccounts();
    market = await ethers.getContract("NFTMarketPlace", deployer);
  });

  it("Should create and excute market sales", async () => {
    const listingPrice = await market.getListingPrice().then((result: BigNumber) => result.toString());
    const auctionPrice = ethers.utils.parseEther("100");

    await market.createToken("https://randomtokenuri.com", auctionPrice, { value: listingPrice })
    await market.createToken("https://randomtokenuri.com", auctionPrice, { value: listingPrice })


    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })

    const items = await market.fetchMarketItems()
    expect(items.length).to.equal(1)
    expect(items[0].sold).to.equal(false)
  })
});
