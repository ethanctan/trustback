// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./DisputeFee.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProtocolPool {
    ERC20 public trustToken;
    address public immutable owner;
    address public immutable genOwner;
    uint stakingRatio = 100; //100 trust = 1 eth
    uint totalStakedEth; //in gwei

    //temp
    // event Deposit(uint maxAllowedEth, uint totalStakedeth, uint msgValue);

    constructor(address _owner, address _genOwner, address _trustToken) {
        owner = _owner;
        genOwner = _genOwner;
        trustToken = ERC20(_trustToken);
        totalStakedEth = 0;
    }

    function stake(uint256 _amount) external {
        require(
            trustToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
    }

    function withdraw(uint _amount) external {
        require(msg.sender == owner, "not owner");
        require(trustToken.balanceOf(address(this)) > 0, "No Stake");
        require(trustToken.transfer(msg.sender, _amount), "Transfer failed");
    }

    // if stake -> deposit, then even after withdrawl the deposit will remain // need to fix
    receive() external payable {
        // Calculate the maximum amount of Ether allowed based on staked Trust
        uint256 maxAllowedEth = (trustToken.balanceOf(address(this)) /
            stakingRatio) * 1e18;

        // Ensure that the incoming Ether doesn't exceed the maximum allowed
        // emit Deposit(maxAllowedEth, totalStakedEth, msg.value);
        require(
            (totalStakedEth + msg.value) <= maxAllowedEth,
            "Exceeds allowed Ether amount"
        );
        totalStakedEth += msg.value;
    }

    function chargeback(uint _amount, address payable _address) external {
        require(msg.sender == genOwner, "invalid caller");
        require(_amount <= address(this).balance, "invalid chargeback");
        _address.transfer(_amount);
    }

    function calculateMaxEth() external view returns (uint) {
        return (trustToken.balanceOf(address(this)) / stakingRatio) * 1e18;
    }

    function viewStakedEth() external view returns (uint) {
        return totalStakedEth;
    }
}
