//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@umb-network/toolbox/dist/contracts/IRegistry.sol";
import "@umb-network/toolbox/dist/contracts/IChain.sol";

import "./interface/L2Subscriber.sol";

/// @title Umbrella L2Notifier
/// @notice Contract that receives a delivery request, verifies data and delivers it
/// @dev Developers may implement this deliverer by their own.
contract L2Notifier {
  IRegistry public immutable registry;

  mapping(bytes32 => uint32) public subscriptions;

  event LogSubscriptionCreated(address indexed subscriber, bytes32 key);

  constructor(address _registry) {
    require(_registry != address(0x0), "_registry is empty");

    registry = IRegistry(_registry);
  }

  /// @notice Register new delivery request, to future block
  /// @param _key bytes32 encoded key
  /// @param _minBlockId minimum Umbrella's sidechain block number to deliver data
  function register(bytes32 _key, uint32 _minBlockId) external returns (bool success) {
    address subscriber = msg.sender;
    bytes32 subscriptionId = resolveId(subscriber, _key);

    require(subscriptions[subscriptionId] == 0, "cannot subscribe multiple times");

    IChain oracle = IChain(registry.getAddress("Chain"));

    require(_minBlockId > oracle.getBlockId(), "should subscribe for the future block");

    subscriptions[subscriptionId] = _minBlockId;

    emit LogSubscriptionCreated(subscriber, _key);

    return true;
  }
  
  /// @notice Notify receiver that its data is ready.
  /// @param _subscriber Receiver Contract address
  /// @param _blockId Umbrella's sidechain block number
  /// @param _key bytes32 encoded key
  /// @param _value value of the given key
  /// @param _proof merkle proof of the layer 2 data
  /// @dev This function already verifies Merkle Proof, so you don't need to verify it at receiver side
  function notify(
    address _subscriber,
    uint32 _blockId,
    bytes32 _key,
    bytes32 _value,
    bytes32[] memory _proof
  ) external returns (bool success) {
    bytes32 subscriptionId = resolveId(_subscriber, _key);

    uint32 minBlockId = subscriptions[subscriptionId];

    require(minBlockId > 0, "cannot find subscription");

    IChain oracle = IChain(registry.getAddress("Chain"));

    uint32 blockId = oracle.getBlockId();

    require(minBlockId <= blockId, "should wait for enough blocks");

    require(
      oracle.verifyProofForBlock(
        _blockId,
        _proof,
        abi.encodePacked(_key),
        abi.encodePacked(_value)
    ),"proof is not valid");

    // Delete subscription, so it is possible to subscribe again.
    delete subscriptions[subscriptionId];

    L2Subscriber(_subscriber).dataVerified(_key, _value);

    return true;
  }

  /// @notice combines subscriber address with key to have an unique id
  function resolveId(address _subscriber, bytes32 _key) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(_subscriber, _key));
  }
}
