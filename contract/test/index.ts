import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { BigNumber, Contract } from "ethers";


describe("NFTMarket", function () {
  let nft: Contract;
  let market: Contract;

  beforeEach(async function () {
    await deployments.fixture(["all",]);
    const { deployer } = await getNamedAccounts();
    nft = await ethers.getContract("NFT", deployer);
    market = await ethers.getContract("NFTMarketPlace", deployer);
  });

  it("Should create and excute market sales", async () => {
    const nftContractAddress = nft.address;

    const listingPrice = await market.getListingPrice().then((result: BigNumber) => result.toString());
    const auctionPrice = ethers.utils.parseEther("100");

    await nft.createToken("https://randomtokenuri.com")
    await nft.createToken("https://randomtokenuri.com")

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

    const items = await market.fetchMarketItems()
    expect(items.length).to.equal(1)
    expect(items[0].sold).to.equal(true)
    // const results = await Promise.all(items.map(async (i: any) => {
    //   const tokenUri = await nft.tokenURI(i.tokenId)
    //   let item = {
    //     price: i.price.toString(),
    //     tokenId: i.tokenId.toString(),
    //     seller: i.seller,
    //     owner: i.owner,
    //     tokenUri
    //   }
    //   return item
    // }))

  })
});
