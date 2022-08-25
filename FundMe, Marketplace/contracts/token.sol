// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Metaverse Tokens", "METT") {
        //owner = payable(msg.sender);
    }

     function createToken(address player,string memory tokenURI)
        public
        
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(player, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        return newTokenId;
    }
}