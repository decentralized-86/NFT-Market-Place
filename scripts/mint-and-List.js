const { ethers } = require("hardhat");
const PRICE = ethers.utils.parseEther("0.1");
async function mintandList() {
  const basicnft = await ethers.getContract("BasicNft");
  const nftmarketplace = await ethers.getContract("Marketplace");
  console.log("minting NFT....");
  const mintTx = await basicnft.mintNft();
  const mintReciept = await mintTx.wait(1);
  const tokenId = await mintReciept.events[0].args.tokenId;
  console.log("Approving nft....");
  const ApproveTx = await basicnft.approve(nftmarketplace.address, tokenId);
  await ApproveTx.wait(1);
  console.log("Approved....");
  console.log("Listing NFT....");
  const ListTx = await nftmarketplace.ListNfts(
    basicnft.address,
    tokenId,
    PRICE
  );
  await ListTx.wait(1);
  console.log("Listed....");
}

mintandList()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
