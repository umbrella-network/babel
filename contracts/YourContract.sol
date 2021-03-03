//SPDX-License-Identifier: Unlicense
pragma solidity >=0.6.8 <=0.8.0;

import "hardhat/console.sol";

// include Chain interface from Umbrella SDK
import "@umb-network/toolbox/dist/contracts/IChain.sol";


contract YourContract {
    // this is UMB oracle contract
    IChain public umbChain;

    // get contract address from trusted source
    constructor(address _umbChainAddress) public {
        require(_umbChainAddress != address(0x0), "_umbChainAddress is empty");

        console.log("Deploying YourContract with Umbrella Chain:", _umbChainAddress);
        umbChain = IChain(_umbChainAddress);
    }

    function getLatestNumericFCD(bytes32 _key) public view returns (uint256) {
        uint256 blockHeight = umbChain.getBlockHeight();
        console.log("Fetching data from UMB Network for current block height", blockHeight);

        uint256 value = umbChain.getSingleNumericData(blockHeight, _key);

        console.log("key:");
        console.logBytes32(_key);
        console.log("value=", value);

        return value;
    }
}
