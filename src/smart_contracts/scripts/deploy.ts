import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { IGeneralStaking } from '../interfaces/GeneralStaking';
import { IDisputeFee } from '../interfaces/DisputeFee';
import { IJurorWalletGen } from '../interfaces/JurorWalletGen'; 
import { IProtocolPoolGen} from '../interfaces/ProtocolPoolGen';

async function main() {
    console.log('Running deployment script...');

    try {
        let generalStaking: Contract;
        let disputeFee: Contract;
        let jurorWalletGen: Contract;
        let protocolPoolGen: Contract;
        let trustAddress = '0x18260909b0ddc83326434bC303560aEaBf21A906';
        let signer;

        [signer] = await ethers.getSigners();
        console.log('Signers obtained');

        // Deploy GeneralStaking
        await ethers.getContractFactory("GeneralStaking");
        console.log("generalStaking contract obtained");
        generalStaking = await ethers.deployContract('GeneralStaking', [trustAddress]) as unknown as (Contract & IGeneralStaking);
        await generalStaking.waitForDeployment();
        let generalStakingAddress = await generalStaking.getAddress();
        console.log('General Staking deployed at: ', generalStakingAddress);
        console.log("Owner Address: ", signer.address);

        // Deploy DisputeFee
        await ethers.getContractFactory("DisputeFee");
        console.log("Dispute Fee contract obtained");
        disputeFee = await ethers.deployContract('DisputeFee', [trustAddress, generalStakingAddress]) as unknown as (Contract & IDisputeFee);
        await disputeFee.waitForDeployment();
        let disputeFeeAddress = await disputeFee.getAddress();
        console.log('Dispute Fee deployed at: ', disputeFeeAddress);

        // Deploy JurorWalletGen
        await ethers.getContractFactory("JurorWalletGen");
        console.log("Juror Wallet Gen contract obtained");
        jurorWalletGen = await ethers.deployContract('JurorWalletGen', [generalStakingAddress]) as unknown as (Contract & IJurorWalletGen);
        await jurorWalletGen.waitForDeployment();
        let jurorWalletGenAddress = await jurorWalletGen.getAddress();
        console.log('Juror Wallet deployed at: ', jurorWalletGenAddress);

        // Set GeneralStaking in other contracts
        await generalStaking.setJurorWalletGen(jurorWalletGenAddress);
        await generalStaking.setDisputeFee(disputeFeeAddress);
        console.log('Set GeneralStaking and DisputeFee in GeneralStaking contract');

        // Deploy ProtocolWalletGen
        await ethers.getContractFactory("ProtocolPoolGen");
        console.log("Protocol Pool Gen contract obtained");
        protocolPoolGen = await ethers.deployContract('ProtocolPoolGen', [trustAddress]) as unknown as (Contract & IProtocolPoolGen);
        await protocolPoolGen.waitForDeployment();
        let protocolPoolGenAddress = await protocolPoolGen.getAddress();
        console.log('ProtocolPool deployed at: ', protocolPoolGenAddress);

    } catch (error) {
        console.error(error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
