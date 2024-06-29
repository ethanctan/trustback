// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ProtocolPool.sol";

contract ProtocolPoolGen {
    address public immutable trustToken;
    address public immutable owner;

    constructor(address _trustToken) {
        owner = msg.sender;
        trustToken = _trustToken;
    }

    mapping(address => address payable) Pools;

    function createPool() external {
        require(
            Pools[msg.sender] == address(0),
            "Chargeback pool already created"
        );

        ProtocolPool contractPool = new ProtocolPool(
            msg.sender,
            address(this),
            trustToken
        );
        Pools[msg.sender] = payable(address(contractPool));
    }

    function viewPoolAddress(address _address) external view returns (address) {
        return Pools[_address];
    }

    function callChargeBack(
        address _protocol,
        address payable _recipient,
        uint _amount
    ) external {
        require(msg.sender == owner, "invalid user");
        require(Pools[_protocol] != address(0), "no pool");

        ProtocolPool contractPool = ProtocolPool(Pools[_protocol]);
        contractPool.chargeback(_amount, _recipient);
    }
}
