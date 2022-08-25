// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import './PriceConverter.sol';

contract FundMe{
    
    using PriceConverter for uint256;

    address immutable i_owner;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    uint256 constant public MINIMUM_USD = 50*10**18;

    constructor(){
        i_owner = msg.sender;
    }

    function Fund() payable public{
        require(msg.value.getConversionRate() > MINIMUM_USD, "You need to send more ETH");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() payable public {
        require(i_owner == msg.sender);

        funders = new address[](0);
        for(uint256 index = 0; index < funders.length; index++){
            address funder = funders[index];
            addressToAmountFunded[funder] = 0;
        }

        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Call Failed");
    }
}