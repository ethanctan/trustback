// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./GeneralStaking.sol";

contract DisputeFee {
    ERC20 public trustToken;
    address public immutable owner;
    address public immutable generalStaking;
    uint256 public disputeCount;

    struct Reward {
        uint256 eth;
        uint256 trust;
    }

    mapping(uint256 => Reward) public rewards;

    constructor(address _trustToken, address _generalStaking) {
        trustToken = ERC20(_trustToken);
        generalStaking = _generalStaking;
        owner = msg.sender;
        disputeCount = 0;
    }

    //Must strictly follow this naming as it will be used for juror case assignmnet and voting - ok
    //REVISIT - could tie to general staking - check
    receive() external payable {
        // Check number of unlocks
        GeneralStaking staking = GeneralStaking(generalStaking);
        require(staking.getMaxCount(msg.sender) > 0, "no chargebacks unlocked");
        // Check dispute fee amount
        require(msg.value >= 20000000, "insufficient fee");
        // If chargebacks are unlocked, then allow dispute fee
        rewards[disputeCount] = Reward({eth: msg.value, trust: 0});
        disputeCount++;
    }

    function reward(
        uint256 _amountTrust,
        uint256 _amountEth,
        address _recipient,
        uint256 _disputeCount
    ) external {
        require(msg.sender == owner, "Invalid caller");
        require(_disputeCount < disputeCount, "Invalid key");
        require(rewards[_disputeCount].eth > 0, "No more eth for this case");
        require(
            rewards[_disputeCount].trust > 0,
            "No (more) trust for this case"
        );

        // Transfer ETH from this contract to the recipient
        payable(_recipient).transfer(_amountEth);
        // Send Trust
        require(
            trustToken.transfer(_recipient, _amountTrust),
            "Transfer failed"
        );

        // Update the reward structure for the specified dispute count
        rewards[_disputeCount].eth -= _amountEth;
        rewards[_disputeCount].trust -= _amountTrust;
    }

    //needs to be called before reward are called - owner of this = owner of general staking
    //must approve general staking
    function transferSlash(uint256 _disputeCount, address _juror) external {
        require(msg.sender == owner, "Invalid caller");
        require(_disputeCount <= disputeCount, "Invalid key");

        GeneralStaking generalStakingContract = GeneralStaking(generalStaking);

        uint slash = generalStakingContract.slashJuror(_juror);

        rewards[_disputeCount].trust += slash;
    }

    //view functions
    function viewDisputeFeeEth(
        uint _disputeCount
    ) external view returns (uint) {
        return rewards[_disputeCount].eth;
    }

    function viewDisputeFeeTrust(
        uint _disputeCount
    ) external view returns (uint) {
        return rewards[_disputeCount].trust;
    }
}
