import '../../App.css';
import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import pendingCheck from '../../components/pendingCheck';
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

// Chakra components
import { Input, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

// My components
import Button from '../../components/button';
import Inputbutton from '../../components/inputbutton';

//@ts-ignore
export default function App({account, contracts, balance, passPendingState, provider}) {
  const [stakeAccount, setStakeAccount] = useState("");
  const [baseContracts, setBaseContracts] = useState<{trust: ethers.Contract, generalStaking: ethers.Contract, disputeFee: ethers.Contract, jurorWalletGen: ethers.Contract, protocolPoolGen: ethers.Contract} | null>(null);
  const [trustBalance, setTrustBalance] = useState("");
  const [pending, setPending] = useState(false);
  const [approved, setApproved] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [totalStaked, setTotalStaked] = useState<string>("");
  // create another hook to count the number of protocols that have been unlocked
  const [unlocks, setUnlocks] = useState<string>("");

  useEffect(() => {
    async function setupContracts() {
        console.log("Staking");
        setStakeAccount(account);
        setBaseContracts(contracts);
        setTrustBalance(balance.balance);
        setTotalStaked(balance.staked);
        setUnlocks((await contracts.generalStaking.getMaxCount(account)).toString());
        console.log("account: ", account);
        console.log("contract: ", contracts);
        console.log("balance: ", balance);
        console.log("unlocks: ", (await contracts.generalStaking.getMaxCount(account)).toString())
    }
    setupContracts();
}, [account, contracts, balance]);

  const approve = async () => {
    passPendingState(true);
    setPending(true);
    const tx = await baseContracts?.trust.approve(baseContracts.generalStaking.address, 100000000000);
    await pendingCheck({txHash: tx.hash, provider: provider})
    //update paramters
    passPendingState(false);
    setPending(false);
    setApproved(true)
  }

  const stake = async (amount : number) => {
    passPendingState(true);
    setPending(true);
    const tx = await baseContracts?.generalStaking.stake(amount)
    await pendingCheck({txHash: tx.hash, provider: provider})
    //update paramters
    setTotalStaked((await baseContracts?.generalStaking.viewStake(account)).toString());
    setTrustBalance((await baseContracts?.trust.balanceOf(account)).toString());
    setUnlocks((await contracts.generalStaking.getMaxCount(account)).toString())
    passPendingState(false);
    setPending(false);
    
  }

  

  return (
    <div className="flex items-center justify-center min-h-screen mb-32">
      <div className="bg-slate-800 shadow-2xl shadow-indigo-500/80 p-5 rounded-lg max-w-xl min-w-1/2">
        <div className="poppins font-medium mb-2 text-left">Stake</div>
    
        {/* we don't need this its just the user's wallet address */}
        {/* <div className="poppins text-sm text-left">
          Account:
          <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
                  <Link 
                      href={`https://etherscan.io/address/${stakeAccount}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-left font-mono"
                  > 
                      {stakeAccount}<ExternalLinkIcon mx='2px' />
                  </Link>
              </div>
        </div> */}
    
        <div className="poppins text-sm text-left">
          Balance:
          <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
            {trustBalance}
          </div>
        </div>
    
        <div className="poppins text-sm text-left">
          Total Staked:
          <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
            {totalStaked}
          </div>
        </div>
    
        <div className="poppins text-sm text-left">
          Number of Protocols Unlocked for Chargebacks:
          <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
            {unlocks}
          </div>
        </div>
    
        {!approved ? (
          <div className="mt-3">
            <Button 
              text="Approve"
              onClick={approve}
              pending={pending} 
            />
          </div>
        ) : (
          <>
            <div className="poppins text-sm text-left mb-2">
              Stake $TRUST to access chargebacks, receive priority dispute consideration, and participate as a juror.
            </div>

            <Inputbutton 
              text={"Stake"}
              placeholder={"Amount of TRUST to Stake"}
              onClick={() => stake(stakeAmount)}
              handleInputChange={(e) => setStakeAmount(Number(e.target.value))}
              inputtype={"number"}
              value={stakeAmount}
            />
          </>
        )}
      </div>
    </div>
  );
  

}

