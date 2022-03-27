import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy, log, get } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    log("----------------------------------------");
    const Market = await get("NFTMarketPlace");
    const NFT = await deploy("NFT", {
        from: deployer,
        log: true,
        args: [Market.address,]
    });
    log("You have deployed the NFT contract to:", NFT.address);
    const networkName = hre.network.name;
    log(
        `Verify with: \n npx hardhat verify --network ${networkName} ${Market.address}`
    );
};
export default func;
func.tags = ["all",];