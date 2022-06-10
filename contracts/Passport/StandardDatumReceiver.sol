// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@umb-network/toolbox/dist/contracts/IChain.sol";
import "@umb-network/toolbox/dist/contracts/IRegistry.sol";
import "@umb-network/toolbox/dist/contracts/lib/ValueDecoder.sol";
import "./interfaces/IDatumReceiver.sol";

/// @title Datum Receiver example implementation
/// @notice This is only an example implementation, and can be entirely rewritten
/// by the needs of the consumer as long as it uses the IDatumReceiver interface. 
contract StandardDatumReceiver is IDatumReceiver, Ownable {
  using ValueDecoder for bytes;

  struct Record {
    uint32 timestamp;
    bytes28 value;
  }

  struct LastUpdate {
    bytes32 updateHash;
    uint32 timestamp;
    uint32 minTimeBetweenUpdates;
  }

  IRegistry public immutable contractRegistry;
  LastUpdate public lastUpdate;

  bytes32 public immutable datumRegistry = bytes32("DatumRegistry");

  mapping(bytes32 => Record) public recordForKey;

  event LogTimeBetweenUpdates(uint32 timeBetweenUpdates);

  /// @notice Makes sure the caller is a trusted source, like DatumRegistry
  modifier onlyFromDatumRegistry(address _msgSender) {
    require(
      contractRegistry.getAddress(datumRegistry) == _msgSender,
        string(abi.encodePacked("caller is not ", datumRegistry))
    );
    _;
  }

  constructor(address _contractRegistry) {
    contractRegistry = IRegistry(_contractRegistry);
  }

  /// @notice Sets the minimum time threshold between approvals
  /// @dev Specified in seconds.
  function setMinTimeBetweenUpdates(uint32 _timeInSeconds) external onlyOwner {
    if (_timeInSeconds == 0) revert("_timeInSeconds is zero");
    if (_timeInSeconds == lastUpdate.minTimeBetweenUpdates) revert("_timeInSeconds is the same");

    lastUpdate.minTimeBetweenUpdates = _timeInSeconds;
    emit LogTimeBetweenUpdates(_timeInSeconds);
  }

  /// @notice Apply the rules of storage or data usage here. In this case it
  /// checks if the received data is stored and if not, stores it. 
  function receivePallet(Pallet calldata _pallet) 
    external
    virtual
    override
    onlyFromDatumRegistry(msg.sender)
  {
    IChain oracle = IChain(contractRegistry.getAddressByString("Chain"));
    IChain.Block memory _block = oracle.blocks(_pallet.blockId);

    bytes32 thisUpdateHash = keccak256(abi.encodePacked(_block.dataTimestamp, _pallet.key));
    require(lastUpdate.updateHash != thisUpdateHash, "update already received");

    lastUpdate.timestamp = _block.dataTimestamp;
    lastUpdate.updateHash = thisUpdateHash;

    Record storage record = recordForKey[_pallet.key];

    record.timestamp = _block.dataTimestamp;
    record.value = bytes28(_pallet.value << 32);
  }

  /// @notice This function shall be view and will be called with a staticcall 
  /// so receiver can preview the content and decide if you wanna pay for it.
  function approvePallet(Pallet calldata _pallet) external view virtual override returns (bool) {
    IChain oracle = IChain(contractRegistry.getAddressByString("Chain"));
    IChain.Block memory _block = oracle.blocks(_pallet.blockId);

    // revert if block is too new given the desired threshold
    require(_block.dataTimestamp > lastUpdate.timestamp + lastUpdate.minTimeBetweenUpdates, 
      "delivery refused: block too old or not needed yet"
    );

    return true;  
  }

  /// @notice Gets Records of keys.
  function getStoredRecords(bytes32[] calldata keys) external view returns (Record[] memory records) {
    records = new Record[](keys.length);

    for (uint256 i = 0; i < keys.length; i++) {
      records[i] = recordForKey[keys[i]];
    }
  }
}
