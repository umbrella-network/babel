// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

/// @notice Holds the information of the Contract interested on receiving data
/// @param receiver The address of the receiver contract
/// @param keys The array of bytes32 encoded keys. Encode with Umbrella's Toolbox to match the correct length.
/// @param funder The address of the wallet that will be allowed to manage funds of this Datum.
/// @param balance The balance in UMB this Datum holds.
/// @param enabled True if the Datum is enabled and eligible to receive data, false if owner doesn't want data.
struct Datum {
  address receiver;
  bytes32[] keys;
  address funder;
  // total supply of UMB can be saved using 89bits, so we good with 128
  uint128 balance;
  bool enabled;
}

/// @notice Holds the information pertinent to that piece of data.
/// @param blockId Umbrella Network sidechain's blockId.
/// @param key Key encoded in bytes32
/// @param value Value encoded in bytes32
/// @param proof Merkle proof to verify that the data was really minted by Umbrella's sidechain. 
struct Pallet {
  uint32 blockId;
  bytes32 key;
  bytes32 value;
  bytes32[] proof; 
}

/// @notice Holds the relation between Datum and the data it's interested on.
/// @param datumId The keccack256 hash that indexes the Datum the delivery goes to.
/// @param indexes With a Pallet[], represents the position on the array that the Pallets this Datum wants is.  
struct Delivery {
  bytes32 datumId;
  uint256[] indexes;
}
