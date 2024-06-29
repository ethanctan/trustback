import Navbar from './components/navbar'
import './App.css'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Route, Routes } from "react-router-dom";
import DisputeDashboard from "./pages/disputeDashboard";
import JurorDashboard from "./pages/jurorDashboard";
import ProtocolDashboard from "./pages/protocolDashboard";
import Stake from "./pages/stake";

function App() {
  const [account, setAccount] = useState(""); // global address variable
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null); //global provider variable
  const [contracts, setContracts] = useState<{trust: ethers.Contract, generalStaking: ethers.Contract, disputeFee: ethers.Contract, jurorWalletGen: ethers.Contract, protocolPoolGen: ethers.Contract} | null>(null); //global contracts variable
  const [jurorWallet, setJurorWallet] = useState<{jurorWallet: ethers.Contract} | null>(null);
  const [protocolPool, setProtocolPool] = useState<{protocolPool: ethers.Contract} | null>(null);
  const [walletInfo, setWalletInfo] = useState<{balance : string, staked : string} | null>(null);
  const [pendingState, setPendingState] = useState(false);

  const passAccount = (account: string) => {
    setAccount(account);
    console.log("global account set: " + account);
  }

  const passContracts = (contracts: {trust: ethers.Contract, generalStaking: ethers.Contract, disputeFee: ethers.Contract, jurorWalletGen: ethers.Contract, protocolPoolGen: ethers.Contract}) => {
    setContracts(contracts);
    console.log("trust contracts set: " + contracts.trust.address);
    console.log("general staking contracts set: " + contracts.generalStaking.address);
    console.log("dispute fee contracts set: " + contracts.disputeFee.address);
    console.log("juror wallet gen contracts set: " + contracts.jurorWalletGen.address);
    console.log("protocol pool gen contracts set: " + contracts.protocolPoolGen.address);
  }

  // set pending state for all transactions
  const passPendingState = (isPending: boolean) => {
    setPendingState(isPending);
    console.log("global pending state set: " + isPending);
  }

  const passProvider = (provider: ethers.providers.JsonRpcProvider) => {
    setProvider(provider);
    console.log("global provider set: " + provider);
  }

  const passSigner = (signer: ethers.Signer) => {
    setSigner(signer);
    console.log("global signer set: " + signer);
  }

  // add params here as needed 
  const getWalletInfo = async (contracts: {trust: ethers.Contract, generalStaking: ethers.Contract, disputeFee: ethers.Contract, jurorWalletGen: ethers.Contract, protocolPoolGen: ethers.Contract}) => {
    if (contracts && account) {
      let balance = (await contracts.trust.balanceOf(account)).toString();
      let stake = (await contracts?.generalStaking.viewStake(account)).toString()
      console.log("Wallet info set: " + balance + " " + stake);
      setWalletInfo({balance: balance, staked: stake});
    }
  }
  
  // not working
  useEffect(() => {
    const fetchContractData = async () => {
      if (account && contracts) {
        await getWalletInfo(contracts);
        try{
          console.log("account: ", account);
          // console.log("juror wallet: ", await contracts.jurorWalletGen.viewJurorWalletAddress(account));
          // console.log("protocol pool: ", await contracts.protocolPoolGen.viewPoolAddress(account));
          const jurorWalletAddress = await contracts.jurorWalletGen.viewJurorWalletAddress(account);
          const poolAddress = await contracts.protocolPoolGen.viewPoolAddress(account);

          setJurorWallet(jurorWalletAddress);
          setProtocolPool(poolAddress);
  
          console.log("Juror Wallet : ", jurorWalletAddress);
          console.log("protocol Pool :", poolAddress);
        }catch(error){
          console.log(error);
        }
      
      }
    };
  
    fetchContractData();
  }, [account, contracts]);


  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const toggleMenuApp = () => {
    setIsMenuExpanded(prevState => !prevState);
  }

  return (
    <>
      <Navbar passAccount={passAccount} passContracts={passContracts} passSigner={passSigner} pendingState={pendingState} passProvider={passProvider} toggleMenuApp={toggleMenuApp} />
      {account?
      <div className={isMenuExpanded ? 'mt-32 lg:mt-0' : ''}>
        <Routes>
          <Route path="/" element={<DisputeDashboard account={account} contracts={contracts} balance={walletInfo} passPendingState={passPendingState} provider={provider} signer={signer}/>} />
          <Route path="/jurordashboard" element={<JurorDashboard account={account} contracts={contracts} balance={walletInfo} passPendingState={passPendingState} jurorWallet={jurorWallet} provider={provider} signer={signer}/>} />
          <Route path="/protocoldashboard" element={<ProtocolDashboard account={account} contracts={contracts} balance={walletInfo} passPendingState={passPendingState} protocolPool={protocolPool} provider={provider} signer={signer}/>} />
          <Route path="/stake" element={<Stake account={account} contracts={contracts} balance={walletInfo} passPendingState={passPendingState} provider={provider}/>} />
        </Routes>
      </div>
      :
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-xl text-white py-4 px-7 w-full poppins">
          Connect your wallet first!
        </div>
      </div>    
      }
    </>
  )
}

export default App
