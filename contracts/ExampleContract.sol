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

/// @title Example of L2D receiver
/// @notice This is an example of customer contract that wants l2d delivered
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

    console.log("Deploying L2Subscriber with Umbrella Registry:", _registry);
    registry = IRegistry(_registry);
  }

  /// @notice Subscribes to a future block with the given key
  /// @param _key the bytes32 encoded key. Can be found at Umbrella's Explorer
  function subscribeL2Value(bytes32 _key) external {
    _notifier().register(_key, _chain().getBlockId() + 10);
  }

  /// @notice Receives data with the key and value, so customer can do whatever he wants with it
  /// @param _key bytes32 encoded key, previously subscribed
  /// @param _value the current value of the given key
  function dataVerified(bytes32 _key, bytes32 _value) external override {
    require(msg.sender == address(_notifier()), "should only called by Umbrella notifier");

    // custom code

    emit LogSubscriptionReceived(_key, _value);
  }

  /// @dev get chain contract dynamically
  function _chain() internal view returns (IChain umbChain) {
    umbChain = IChain(registry.getAddressByString("Chain"));
    console.log("umbChain:");
    console.logAddress(address(umbChain));
  }

  /// @dev get Umbrella's trusted notifier
  function _notifier() internal view returns (L2Notifier notifier) {
    notifier = L2Notifier(registry.getAddressByString("L2Notifier"));
    console.log("L2Notifier:");
    console.logAddress(address(notifier));
  }
}
