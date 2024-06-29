// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./GeneralStaking.sol";
import "./JurorWallet.sol";

contract JurorWalletGen {
    address public immutable owner;
    address public immutable generalStaking;
    uint MINSTAKE = 10000;

    constructor(address _generalStaking) {
        generalStaking = _generalStaking;
        owner = msg.sender;
    }

    mapping(address => address) Jurors;

    //ok
    function createJurorWallet() external {
        require(Jurors[msg.sender] == address(0), "Wallet already created");

        GeneralStaking generalStakingContract = GeneralStaking(generalStaking);
        require(
            generalStakingContract.viewStake(msg.sender) > MINSTAKE,
            "insufficient stake"
        );

        JurorWallet newWallet = new JurorWallet(msg.sender, generalStaking);
        Jurors[msg.sender] = address(newWallet);
    }

    function viewJurorWalletAddress(
        address _address
    ) external view returns (address) {
        return Jurors[_address];
    }
}
