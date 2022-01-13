//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface L2Subscriber {
  function dataVerified(bytes32 _key, bytes32 _value) external returns(bool);
}
