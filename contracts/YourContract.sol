//SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

// include Chain interface from Umbrella SDK
import "@umb-network/toolbox/dist/contracts/IChain.sol";
import "@umb-network/toolbox/dist/contracts/IRegistry.sol";
import "@umb-network/toolbox/dist/contracts/lib/ValueDecoder.sol";


contract YourContract {
    using ValueDecoder for bytes;

    // registry wit all contract addresses, most important is `Chain`
    IRegistry public registry;

    // get contract address from trusted source
    constructor(address _registry) {
        require(_registry != address(0x0), "_registry is empty");

        console.log("Deploying YourContract with Umbrella Registry:", _registry);
        registry = IRegistry(_registry);
    }

    function blockInfo(uint256 _blockId) public {
        console.log("Fetching block from UMB Network for block id", _blockId);

        IChain.Block memory blockData = _chain().blocks(_blockId);

        console.log("root:");
        console.logBytes32(blockData.root);
        console.log("timestamp:", blockData.dataTimestamp);
    }

    function latestBlockInfo() public {
        blockInfo(_chain().getLatestBlockId());
    }

    function getPrice(bytes32 _key) public view returns (uint256) {
        console.log("Fetching data from UMB Network");

        (uint256 value, uint256 timestamp) = _chain().getCurrentValue(_key);

        require(timestamp > 0, "value does not exists");

        console.log("key:");
        console.logBytes32(_key);
        console.log("value=", value);
        console.log("timestamp=", timestamp);

        return value;
    }

    function verifyProofForBlockForNumber(
        uint32 _blockId,
        bytes32[] memory _proof,
        bytes memory _key,
        bytes memory _value
    ) public view returns (bool, uint256) {
        return (_chain().verifyProofForBlock(_blockId, _proof, _key, _value), _value.toUint());
    }

    function _chain() internal view returns (IChain umbChain) {
        umbChain = IChain(registry.getAddress("Chain"));
        console.log("umbChain:");
        console.logAddress(address(umbChain));
    }
}
