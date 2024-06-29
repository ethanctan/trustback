import { ethers } from "ethers";
import Trust from '../../../../smart_contracts/artifacts/contracts/TRUST.sol/TRUST.json';
import GeneralStaking from '../../../../smart_contracts/artifacts/contracts/GeneralStaking.sol/GeneralStaking.json';
import DisputeFee from '../../../../smart_contracts/artifacts/contracts/DisputeFee.sol/DisputeFee.json';
import JurorWalletGen from '../../../../smart_contracts/artifacts/contracts/JurorWalletGen.sol/JurorWalletGen.json';
import ProtocolPoolGen from '../../../../smart_contracts/artifacts/contracts/ProtocolPoolGen.sol/ProtocolPoolGen.json';
import JurorWallet from '../../../../smart_contracts/artifacts/contracts/JurorWallet.sol/JurorWallet.json';
import ProtocolPool from '../../../../smart_contracts/artifacts/contracts/ProtocolPool.sol/ProtocolPool.json';
import { ConnectWallet } from "@thirdweb-dev/react";

//Replace these addresses with those deployed on mainnet
const tokenAddress = "0x18260909b0ddc83326434bC303560aEaBf21A906";
const generalStakingAddress = '0xa7f324a87B1cbCeA61D98aAd07612f6f5660bD26';
const disputeFeeAddress = '0xD52a7A418FB61392C0Ada5f8c1E5d2fF44FEB976';
const jurorWalletGenAddress = '0x8B74e786DE8641495898b7B00CE7646896dBAAc5';
const protocolPoolGenAddress = '0xBb642A36E2F406442a7E5E974A777D2c9f6FAB3b';

export const getProvider = async () => {
    // For hardhat testnet
    // return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    if (!window.ethereum) {
      throw new Error("Please install Metamask");
    }

    await window.ethereum.enable();  
    return new ethers.providers.Web3Provider(window.ethereum);
}


export const getWallet = async (provider: any) => {
  // For hardhat testnet
// const accounts = await provider.listAccounts();
// const signer = provider.getSigner(accounts[0]);

    const signer = await provider.getSigner();
    const account = await signer.getAddress();

    return { signer: signer, account: account };
}

export const getContract = (signer: any) => {
  let trustContract = new ethers.Contract(tokenAddress, Trust.abi, signer);
  let generalStakingContract = new ethers.Contract(generalStakingAddress, GeneralStaking.abi, signer);
  let disputeFeeContract = new ethers.Contract(disputeFeeAddress, DisputeFee.abi, signer);
  let jurorWalletGenContract = new ethers.Contract(jurorWalletGenAddress, JurorWalletGen.abi, signer);
  let protocolPoolGenContract = new ethers.Contract(protocolPoolGenAddress, ProtocolPoolGen.abi, signer);
  return { trust: trustContract, generalStaking: generalStakingContract, disputeFee: disputeFeeContract, jurorWalletGen : jurorWalletGenContract, protocolPoolGen : protocolPoolGenContract };
}

export const getJurorWalletInstance = (signer: any, address: any) => {
  let jurorWalletInstance = new ethers.Contract(address, JurorWallet.abi, signer);
  return {jurorWallet: jurorWalletInstance}
}

export const getProtocolPoolInstance = (signer: any, address: any) => {
  let protocolPoolInstance = new ethers.Contract(address, ProtocolPool.abi, signer);
  return {protocolPool: protocolPoolInstance}
}
