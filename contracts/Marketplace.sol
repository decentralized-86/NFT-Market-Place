//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

/* IMPORTS */
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
/* errors */
error Marketplace__PriceShouldbeGreaterThanZero();
error Marketplace__Address_notApproved();
error Marketplace__NftAlreadylisted(address nftAddress, uint256 tokenId);
error Marketplace__Only_NftListed();
error Marketplace__isnotListed();
error Marketplace__PriceNotmet();
error Marketplace__noProceeds();
error TransactionReverted();

contract Marketplace is ReentrancyGuard{
  struct Listing {
    uint256 price;
    address seller;
  }
  /* State Variables  */
  mapping(address => mapping(uint256 => Listing)) private s_listings;

  //
  mapping(address => uint256) private s_proceeds;

  /* Modifiers */
  modifier listed(address nftAddress, uint tokenId) {
    Listing storage listing = s_listings[nftAddress][tokenId];
    if (listing.price <= 0) revert Marketplace__isnotListed();
    _;
  }
  modifier Not_listed(
    address nftAddress,
    address seller,
    uint tokenId
  ) {
    Listing storage list = s_listings[nftAddress][tokenId];
    if (list.price > 0)
      revert Marketplace__NftAlreadylisted(nftAddress, tokenId);
    _;
  }
  modifier only_owner(address nftcontractAddress, uint tokenId) {
    IERC721 nft = IERC721(nftcontractAddress);
    address owner = nft.ownerOf(tokenId);
    if (owner != msg.sender) revert Marketplace__Only_NftListed();
    _;
  }

  /* Events */
  event Itemlisted(
    address indexed seller,
    address indexed nftAddress,
    uint indexed tokenId,
    uint price
  );
  event Itembought(
    address indexed nftcontractaddress,
    address indexed soldto,
    uint indexed tokenId,
    uint256 price
  );
  event Itemcancelled(
    address indexed seller,
    address indexed nftcontractaddress,
    uint256 tokenId
  );
  event ListingUpdated(
    address indexed nftcontractaddress,
    uint256 indexed  tokenId,
    uint256 indexed newprice
  );

  /*
   * @notice Method for listing NFT
   * @param nftAddress Address of NFT contract
   * @param tokenId Token ID of NFT
   * @param price sale price for each item
   */
  function ListNfts(
    address NftcontractAddress,
    uint tokenID,
    uint Price
  )
    external
    Not_listed(NftcontractAddress, msg.sender, tokenID)
    only_owner(NftcontractAddress, tokenID)
  {
    if (Price == 0) revert Marketplace__PriceShouldbeGreaterThanZero();
    /* * NFT's Could be listed in the market place in two ways
     * Transferring the NFT to the market contract
     * giving the allwance to the NFT's contract to sell  the NFT
     * owner can remove the allowance anytime they want and the contract would not be able to sell the asset
     */
    IERC721 nft = IERC721(NftcontractAddress);
    if (nft.getApproved(tokenID) != address(this))
      revert Marketplace__Address_notApproved();
    s_listings[NftcontractAddress][tokenID] = Listing(Price, msg.sender);
    /* Emit event after updating the Mapping */
    emit Itemlisted(msg.sender, NftcontractAddress, tokenID, Price);
  }

  function BuyNfts(
    address nftcontractAddress,
    uint256 tokenId
  ) external payable listed(nftcontractAddress, tokenId) nonReentrant {
    Listing storage listing = s_listings[nftcontractAddress][tokenId];
    if (listing.price > msg.value) revert Marketplace__PriceNotmet();
    s_proceeds[listing.seller] = s_proceeds[listing.seller] + msg.value;
    delete (s_listings[nftcontractAddress][tokenId]);
    IERC721(nftcontractAddress).safeTransferFrom(
      listing.seller,
      msg.sender,
      tokenId
    );
    emit Itembought(nftcontractAddress, msg.sender, tokenId, listing.price);
  }

  /* Cancel listing */
  function Cancelisting(
    address nftcontractaddress,
    uint256 tokenId
  )
    external
    only_owner(nftcontractaddress, tokenId)
    listed(nftcontractaddress, tokenId)
  {
    delete (s_listings[nftcontractaddress][tokenId]);
    emit Itemcancelled(msg.sender,nftcontractaddress,tokenId);
  }

  /* A good practice is to use push ver pull 
  Don't send the money to the  user but let them withdraw the money
*/

  /* update Listing */
  function UpdateListing(address nftcontractaddress,uint256 tokenId,uint newlistingPrice) external only_owner(nftcontractaddress, tokenId) listed(nftcontractaddress, tokenId){
     s_listings[nftcontractaddress][tokenId].price = newlistingPrice;
     emit ListingUpdated(nftcontractaddress,tokenId,newlistingPrice);

  }

  /* Withdraw function to withdraw the money after selling the nft */
  function withdrawProcess() external {
    uint256 proceeds = s_proceeds[msg.sender];
    if(proceeds <= 0) revert Marketplace__noProceeds();
    s_proceeds[msg.sender] = 0;
    (bool success,) = payable(msg.sender).call{value:proceeds}("");
    if(!success) revert TransactionReverted();
  }

  /* Getter functions */
  function Getlisting(address nftcontractaddress,uint tokenId) external view returns(Listing memory){
    return s_listings[nftcontractaddress][tokenId];
  }
  function GetProceeds(address sender) external view returns(uint256){
    return s_proceeds[sender];
}
}
