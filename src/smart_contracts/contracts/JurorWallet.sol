// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./GeneralStaking.sol";

contract JurorWallet {
    address public immutable owner;
    address public immutable generalStaking;
    bool public hasColluded;

    constructor(address _owner, address _generalStaking) {
        owner = _owner;
        generalStaking = _generalStaking;
        hasColluded = false;
    }

    struct Case {
        bytes32 hash;
        bytes32 commitment;
        uint256 salt;
    }
    mapping(uint => Case) Cases;

    // Note: techncially anyone can vote for a given case, but our reward system is manual so don't matter
    // ok
    function addHash(uint _caseNum, uint _salt) external {
        require(msg.sender == owner, "not your wallet");
        require(Cases[_caseNum].hash == 0x00, "Already submitted hash");
        Cases[_caseNum].hash = keccak256(abi.encode(_salt));
    }

    // 1 for yes, 2 for no - ok
    function commit(uint _caseNum, uint _salt, uint _vote) external {
        require(msg.sender == owner, "not your wallet");
        require(Cases[_caseNum].hash != 0x00, "Have no submitted hash");
        require(Cases[_caseNum].commitment == 0x00, "Already committed");
        Cases[_caseNum].commitment = keccak256(abi.encode(_salt + _vote));
    }

    // ok
    function addSalt(uint _caseNum, uint256 _salt) external {
        require(msg.sender == owner, "not your wallet");
        require(
            Cases[_caseNum].hash != 0x00 && Cases[_caseNum].commitment != 0x00,
            "no case or vote"
        );
        require(
            Cases[_caseNum].hash == keccak256(abi.encode(_salt)),
            "wrong salt"
        );
        Cases[_caseNum].salt = _salt;
    }

    //must approve both jurorWallet and general staking -ok
    function reportCollusion(uint _caseNum, uint _salt) public {
        require(msg.sender != owner, "cannot report yourself");
        require(Cases[_caseNum].salt == 0, "salt already revealed");
        require(
            Cases[_caseNum].hash != 0x00 && Cases[_caseNum].commitment != 0x00,
            "no case or vote"
        );
        require(
            Cases[_caseNum].hash == keccak256(abi.encode(_salt)),
            "wrong salt"
        );
        hasColluded = true;
        GeneralStaking gen = GeneralStaking(generalStaking);
        gen.transferStake(msg.sender, owner, address(this));
        hasColluded = false;
    }

    //ok
    function viewVotingStatus(uint _caseNum) external view returns (bool) {
        return
            (Cases[_caseNum].hash != 0x00) &&
            (Cases[_caseNum].commitment != 0x00);
    }

    //ok
    function viewParticipationStatus(
        uint _caseNum
    ) external view returns (bool) {
        return Cases[_caseNum].hash != 0x00;
    }
}
