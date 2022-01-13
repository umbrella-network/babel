//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

// include Chain interface from Umbrella SDK
import "@umb-network/toolbox/dist/contracts/IChain.sol";
import "@umb-network/toolbox/dist/contracts/IRegistry.sol";
import "@umb-network/toolbox/dist/contracts/lib/ValueDecoder.sol";

import "./interface/L2Subscriber.sol";
import "./L2Notifier.sol";


contract ExampleContract is L2Subscriber {
  using ValueDecoder for bytes;
  using ValueDecoder for bytes32;

  // by default, all values stored in Umbrella are stored as numbers with 18 decimals
  uint256 public constant MULTIPLIER = 1e18;

  // registry wit all contract addresses, most important is `Chain`
  IRegistry public registry;

  event LogSubscriptionReceived(bytes32 key, bytes32 value);

  // get contract address from trusted source
  constructor(address _registry) {
    require(_registry != address(0x0), "_registry is empty");

    console.log("Deploying YourContract with Umbrella Registry:", _registry);
    registry = IRegistry(_registry);
  }

  function subscribeL2Value(bytes32 _key) external returns (bool) {
    _notifier().register(_key, _chain().getBlockId() + 10);

    return true;
  }

  function dataVerified(bytes32 _key, bytes32 _value) external override returns (bool) {
    require(msg.sender == address(_notifier()), "should only called by Umbrella notifier");

    // custom code

    emit LogSubscriptionReceived(_key, _value);

    return true;
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

  function _chain() internal view returns (IChain umbChain) {
    umbChain = IChain(registry.getAddressByString("Chain"));
    console.log("umbChain:");
    console.logAddress(address(umbChain));
  }

  function _notifier() internal view returns (L2Notifier notifier) {
    notifier = L2Notifier(registry.getAddressByString("L2Notifier"));
    console.log("L2Notifier:");
    console.logAddress(address(notifier));
  }
}
