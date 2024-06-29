// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./JurorWalletGen.sol";
import "./JurorWallet.sol";

contract GeneralStaking {
    ERC20 public trustToken;
    address public immutable owner;
    address public disputeFee;
    address public jurorWalletGen;

    constructor(address _trustToken) {
        trustToken = ERC20(_trustToken);
        owner = msg.sender;
    }

    uint constant MINSTAKE = 1000;
    uint constant SLASHPERCENTAGE = 5;
    mapping(address => uint) Stakers;

    //set up - ok
    function setDisputeFee(address _disputeFee) external {
        require(msg.sender == owner, "invalid user");
        disputeFee = _disputeFee;
    }

    function setJurorWalletGen(address _jurorWalletGen) external {
        require(msg.sender == owner, "invalid user");
        jurorWalletGen = _jurorWalletGen;
    }

    //staking - ok
    function stake(uint256 _amount) external setup {
        require(
            trustToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        Stakers[msg.sender] += _amount;
    }

    function withdraw(uint _amount) external setup {
        require(Stakers[msg.sender] > 0, "No Stake");
        require(trustToken.transfer(msg.sender, _amount), "Transfer failed");
        Stakers[msg.sender] -= _amount;
    }

    //Users - ok
    function getMaxCount(address _address) external view setup returns (uint) {
        //no need to track protocols -> we just track max amount and let them choose between, to be called after stake/withdraw
        return Stakers[_address] / MINSTAKE;
    }

    //Jurors - to check
    function slashJuror(address _address) external setup returns (uint) {
        require(msg.sender == disputeFee, "invalid user");
        require(Stakers[_address] > 0, "juror has no stake");
        require(
            trustToken.transfer(
                disputeFee,
                (Stakers[_address] * SLASHPERCENTAGE) / 100
            ),
            "Transfer failed"
        );
        Stakers[_address] -= (Stakers[_address] * SLASHPERCENTAGE) / 100;
        return Stakers[_address];
    }

    // ok
    function transferStake(
        address _accuser,
        address _acusee,
        address _acuseeWallet
    ) external setup {
        JurorWalletGen gen = JurorWalletGen(jurorWalletGen);
        require(
            gen.viewJurorWalletAddress(_acusee) != address(0),
            "invalid user"
        );

        JurorWallet juror = JurorWallet(_acuseeWallet);
        require(juror.hasColluded() == true, "collusion not verified");
        trustToken.transferFrom(
            _acusee,
            _accuser,
            trustToken.balanceOf(_acusee)
        );
    }

    //Both users and jurors - ok - ceiling 100, base of 0
    function getPriority(address _address) external view setup returns (uint) {
        return (Stakers[_address] * 100) / trustToken.balanceOf(address(this));
    }

    //view functions - ok
    function viewStake(address _address) external view setup returns (uint) {
        return Stakers[_address];
    }

    modifier setup() {
        require(disputeFee != address(0), "setup disputeFee");
        require(jurorWalletGen != address(0), "setup jurorWalletGen");
        _;
    }
}
