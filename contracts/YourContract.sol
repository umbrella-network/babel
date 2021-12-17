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
    using ValueDecoder for bytes32;

    // by default, all values stored in Umbrella are stored as numbers with 18 decimals
    uint256 constant public MULTIPLIER = 1e18;

    // registry wit all contract addresses, most important is `Chain`
    IRegistry public registry;

    // get contract address from trusted source
    constructor(address _registry) {
        require(_registry != address(0x0), "_registry is empty");

        console.log("Deploying YourContract with Umbrella Registry:", _registry);
        registry = IRegistry(_registry);
    }

    function blockInfo(uint256 _blockId) public view {
        console.log("Fetching block from UMB Network for block id", _blockId);

        IChain.Block memory blockData = _chain().blocks(_blockId);

        console.log("root:");
        console.logBytes32(blockData.root);
        console.log("timestamp:", blockData.dataTimestamp);
    }

    function latestBlockInfo() public view {
        blockInfo(_chain().getLatestBlockId());
    }

    function getPrice(bytes32 _key) public view returns (uint256) {
        console.log("Fetching data from UMB Network");
        console.log("key:");
        console.logBytes32(_key);

        (uint256 value, uint256 timestamp) = _chain().getCurrentValue(_key);

        require(timestamp > 0, "value does not exists");

        console.log("value=", value);
        console.log("timestamp=", timestamp);

        return value;
    }

    function verifyProofForBlockForNumber(
        uint32 _blockId,
        bytes32[] memory _proof,
        bytes memory _key,
        bytes memory _value
    ) public view returns (bool success, uint256 value) {
        return verifyProofForBlockForNumberOnChain(_blockId, _proof, _key, _value, _chain());
    }

    function verifyProofForBlockForNumberOnChain(
        uint32 _blockId,
        bytes32[] memory _proof,
        bytes memory _key,
        bytes memory _value,
        IChain chain
    ) public view returns (bool success, uint256 value) {
        (success, value) = (chain.verifyProofForBlock(_blockId, _proof, _key, _value), _value.toUint());

        console.log("verification status:", success);
        require(success, "proof is invalid, this key-value data can not be trusted");

        console.log("value you can use on-chain:", value);
    }

    function calculatePrice(uint256 _value1, uint256 _value2) public view returns (uint256 price) {
        price = _value1 * MULTIPLIER / _value2;

        console.log("value 1:", _value1);
        console.log("value 2:", _value2);
        console.log("calculated price", price);
    }

    function calculateEthBtcPriceFCDExample(bytes32[] memory _keys) public view returns (uint256) {
        console.log("Fetching FCD data from UMB Network");

        (uint256[] memory values, uint32[] memory timestamps) = _chain().getCurrentValues(_keys);

        require(timestamps[0] > 0, "value does not exists");
        require(timestamps[1] - timestamps[0] == 0, "values are not from same consensus round");

        return calculatePrice(values[0], values[1]);
    }

    function calculateEthBtcPriceL2Example(
        uint32[] memory _blockIds,
        bytes memory _proofs,
        uint256[] memory _proofItemsCounter,
        bytes32[] memory _keys,
        bytes32[] memory _values
    ) public view returns (uint256) {
        bytes32[] memory leaves = new bytes32[](2);
        leaves[0] = keccak256(abi.encode(_keys[0], _values[0]));
        leaves[1] = keccak256(abi.encode(_keys[1], _values[1]));

        (bool[] memory results) = _chain().verifyProofs(_blockIds, _proofs, _proofItemsCounter, leaves);

        for (uint256 i = 0; i < results.length; i++) {
            console.log("Verifying proof #", i);
            require(results[i], "invalid proof");
        }

        console.log("Data verified!");
        console.log("uint value #1", _values[0].toUint());
        console.log("uint value #2", _values[1].toUint());

        return calculatePrice(_values[0].toUint(), _values[1].toUint());
    }

    function _chain() internal view returns (IChain umbChain) {
        umbChain = IChain(registry.getAddressByString("Chain"));
        console.log("umbChain:");
        console.logAddress(address(umbChain));
    }
}
