pragma solidity ^0.4.2;

contract SimpleStorage {
  uint storedData;

  function SimpleStorage(uint number){
    storedData = number;
  }

  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (uint) {
    return storedData;
  }
}
