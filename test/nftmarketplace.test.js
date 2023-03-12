const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentchains } = require("../helper-hardhat.config");

!developmentchains.includes(network.name)
  ? describe.skip
  : describe("NFT marketplace units test", function () {
      let nftmarketplace, nftmarketplacecontract, basicnftcontract, basicnft;
      const PRICE = ethers.utils.parseEther("0.1");
      const TOKEN_ID = 0;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        const deployer = accounts[0];
        const player = accounts[1];
        await deployments.fixture["all"];
        nftmarketplacecontract = await ethers.getContract("marketplace");
        nftmarketplace = nftmarketplacecontract.connect(deployer);
        basicnftcontract = await ethers.getContract("basicnft");
        basicnft = basicnftcontract.connect(deployer);
        await basicnft.mintNft();
        await basicnft.approve(nftmarketplacecontract.address, TOKEN_ID);
      });
      //Listing NFTS
      describe("items can be listed and can be bought", async function () {
        await nftmarketplace.ListNfts(
          basicnftcontract.address,
          TOKEN_ID,
          PRICE
        );
        const playerconnectedNFTmarketplace = nftmarketplace.connect(player);
        await playerconnectedNFTmarketplace.BuyNfts(
          basicnftcontract.address,
          TOKEN_ID,
          { value: PRICE }
        );
        const newowner = await basicnft.ownerOf(TOKEN_ID);
        const deployerProceeds = await nftmarketplace.GetProceeds(deployer);
        assert(newowner.toString() == player.address);
        assert(deployerProceeds.toString() == PRICE.toString());
      });
      //BuyNfts
      //Cancelisting
      //UpdateListing
      //withdrawProcess
    });
