import '../../App.css';
import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import pendingCheck from '../../components/pendingCheck';
import { getProtocolPoolInstance } from '../../utils/ethers';

// My components
import Button from '../../components/button';
import Inputbutton from '../../components/inputbutton';

// Chakra components
import { Input, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

//.env variables
const API_URL = import.meta.env.VITE_API_URL

//@ts-ignore
function App({account, contracts, balance, passPendingState, provider, signer, protocolPool}) {
  const [protocolAccount, setProtocolAccount] = useState("");
  const [protocolSigner, setProtocolSigner] = useState<ethers.Signer | null>(null);
  const [baseContracts, setBaseContracts] = useState<{trust: ethers.Contract, generalStaking: ethers.Contract, disputeFee: ethers.Contract, jurorWalletGen: ethers.Contract, protocolPoolGen: ethers.Contract} | null>(null);
  const [trustBalance, setTrustBalance] = useState(""); //user's trust amount
  const [pending, setPending] = useState(false);
  const [approved, setApproved] = useState(false);
  const [stakeTrustAmount, setStakeTrustAmount] = useState<number>(0); //temp hook for staking trust
  const [ethAmount, setEthAmount] = useState<number>(0); // temp hook for staking eth
  const [totalTrustStaked, setTotalTrustStaked] = useState<string>(""); // track total trust staked
  const [totalEthStaked, setTotalEthStaked] = useState<string>(""); // track total eth staked
  const [protocolInstance, setProtocolInstance] = useState(""); //protocolPool Addy
  const [protocolContract, setProtocolContract] = useState<{protocolPool: ethers.Contract} | null>(null); //contract instance
  const [collateralSize, setCollateralSize] = useState<string>(""); 

  useEffect(() => {
    async function setupContracts() {
        console.log("Protocol Dashboard");
        setProtocolAccount(account);
        setBaseContracts(contracts);
        setTrustBalance(balance.balance);
        setProtocolInstance(protocolPool);
        console.log("!!!!!: ", protocolPool)
        // excuse the horrible syntax
        {protocolPool != "0x0000000000000000000000000000000000000000" ? setProtocolContract(await getProtocolPoolInstance(signer, protocolPool)): null}
        {protocolPool != "0x0000000000000000000000000000000000000000" ? setTotalTrustStaked((await contracts?.trust.balanceOf(protocolPool)).toString()) : null}
        {protocolPool != "0x0000000000000000000000000000000000000000" ? setTotalEthStaked((await (await getProtocolPoolInstance(signer, protocolPool))?.protocolPool.viewStakedEth()).toString()) : null}
        {protocolPool != "0x0000000000000000000000000000000000000000" ? setCollateralSize((await (await getProtocolPoolInstance(signer, protocolPool))?.protocolPool.calculateMaxEth()).toString()): null}
        console.log("account: ", account);
        console.log("contract: ", contracts);
        console.log("balance: ", balance);

    }
    setupContracts();
}, [account, contracts, balance, protocolPool]);

  const createProtocolPool = async () => {
    passPendingState(true);
    setPending(true);
    const tx = await baseContracts?.protocolPoolGen.createPool();
    await pendingCheck({txHash: tx.hash, provider: provider})
    //update paramters
    passPendingState(false);
    setPending(false);
    setProtocolInstance(await baseContracts?.protocolPoolGen.viewPoolAddress(account));
    console.log("protocol pool: ", await baseContracts?.protocolPoolGen.viewPoolAddress(account));
    setProtocolContract(await getProtocolPoolInstance(signer, protocolPool));
    console.log("juror wallet contract instantiated: ", await getProtocolPoolInstance(signer, protocolPool))
    setTotalTrustStaked((await baseContracts?.trust.balanceOf(protocolInstance)).toString());
    setTotalEthStaked((await protocolContract?.protocolPool.viewStakedEth()).toString());
  }

  const approve = async () => {
    if (protocolInstance != "0x0000000000000000000000000000000000000000") {
      passPendingState(true);
      setPending(true);
      const tx = await baseContracts?.trust.approve(protocolInstance, 100000000000);
      await pendingCheck({txHash: tx.hash, provider: provider})
      //update paramters
      passPendingState(false);
      setPending(false);
      setApproved(true)
    }
    else{
      console.log("protocol pool not setup yet")
    }
  }

  const stake = async () => {
    if (protocolInstance != "0x0000000000000000000000000000000000000000") {
      passPendingState(true);
      setPending(true);
      const tx = await protocolContract?.protocolPool.stake(stakeTrustAmount);
      await pendingCheck({txHash: tx.hash, provider: provider})
      //update paramters
      setTrustBalance((await baseContracts?.trust.balanceOf(account)).toString());
      setTotalTrustStaked((await baseContracts?.trust.balanceOf(protocolInstance)).toString());
      setCollateralSize((await protocolContract?.protocolPool.calculateMaxEth()).toString())
      passPendingState(false);
      setPending(false);
    }else{
      console.log("protocol pool not setup yet")
    }
  }

  const fundPool = async() => {
    if (protocolInstance != "0x0000000000000000000000000000000000000000") {
      passPendingState(true);
      setPending(true);
      const value = ethers.utils.parseEther(ethAmount.toString()); // convert eth to wei
      const tx = await signer.sendTransaction({
        to: protocolInstance,  // Assuming disputeFee is the contract instance
        value: value //Dispute fee of 0.00000000002 Eth
     });
      await pendingCheck({txHash: tx.hash, provider: provider})
      //update paramters
      setTotalEthStaked((await protocolContract?.protocolPool.viewStakedEth()).toString());
      passPendingState(false);
      setPending(false);
    }else{
      console.log("protocol pool not setup yet")
    }
  }

  // TODO after Saturday: Abstract this into its own component
  // create variables to store the data from the get request
  const [data, setData] = useState([]);

  // get request
  const getSubmissions = async () => {
    // Send a GET request to your backend endpoint
    const response = await fetch(`${API_URL}/user/info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        // Handle successful response from the server
        const data = await response.json();
        console.log(data);
        setData(data);
    }
    else {
        // Handle error response from the server
        console.error('Submission retrieval failed');
    }
  };

  // call getSubmissions on load only once
  useEffect(() => {
    getSubmissions();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mb-32">
      <div className="bg-slate-800 shadow-2xl shadow-indigo-500/80 p-5 rounded-lg max-w-xl">
        <div className="poppins font-medium mb-2 text-left">Protocol Dashboard</div>

        <div className="poppins text-sm text-left">Your $TRUST Balance:
          <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
            {trustBalance}
          </div>
        </div>
    
        {protocolInstance !== "0x0000000000000000000000000000000000000000" ? (
          <>
            <div className="poppins text-sm text-left">Your Pool Address:
              <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
                  <Link 
                      href={`https://etherscan.io/address/${protocolInstance}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-left font-mono"
                  > 
                      {protocolInstance}<ExternalLinkIcon mx='2px' />
                  </Link>
              </div>
            </div>
    
            <div className="poppins text-sm text-left">Your Staked Trust:
              <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
                {totalTrustStaked}
              </div>
            </div>
    
            <div className="poppins text-sm text-left">Your Staked Eth:
              <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
                {totalEthStaked == "" ? "Loading..." : ethers.utils.formatEther(totalEthStaked)}
              </div>
            </div>
    
            <div className="poppins text-sm text-left">Your Collateral Size:
              <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
                {collateralSize == "" ? "Loading..." : ethers.utils.formatEther(collateralSize)}
              </div>
            </div>
    
            {approved ? (
              <>
                <div className="poppins text-sm text-left mb-2">
                  Stake $TRUST to increase your maximum pool size.
                </div>

                <Inputbutton 
                  text={"Stake"}
                  placeholder={"Amount of TRUST to Stake"}
                  onClick={stake}
                  handleInputChange={(e) => setStakeTrustAmount(Number(e.target.value))}
                  inputtype={"number"}
                  value={stakeTrustAmount}
                />

                <div className="poppins text-sm text-left my-2">
                  Fund your pool with ETH.
                </div>

                <Inputbutton 
                  text={"Fund Pool"}
                  placeholder={"Amount of ETH to Fund"}
                  onClick={fundPool}
                  handleInputChange={(e) => setEthAmount(Number(e.target.value))}
                  inputtype={"number"}
                  value={ethAmount}
                />
              </>
            ) : (
              <div className="mt-3">
                <Button 
                  onClick={approve}
                  text={"Approve $TRUST"}
                  pending={pending}
                />
              </div>
            )}
          </>
        ) : (
          <Button
            onClick={createProtocolPool}
            text={"Create Protocol Pool"}
            pending={pending}
          />
        )}
      </div>

    
      <>
        <div className="text-lg poppins font-medium mb-4 mt-16"> Your Disputes </div>
        <div className="w-fit border rounded-lg overflow-hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-700">
            <table className="divide-y divide-gray-200 divide-gray-700 table-auto">
            <thead>
                <tr>
                  <th scope="col" className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      Hash
                  </th>
                  <th scope="col" className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      Protocol
                  </th>
                  <th scope="col" className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      Elaboration
                  </th>
                  <th scope="col" className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      Appeals Open
                  </th>
                  <th scope="col" className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      Appeals Close
                  </th>
                  <th scope="col" className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      Status
                  </th>
                </tr>
            </thead>
              <tbody className="divide-y divide-gray-200 divide-gray-700 font-mono">
                {data.map((submission : any) => (
                  <tr>
                    <td className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      {submission.txnHash}
                    </td>
                    <td className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      {submission.protocol}
                    </td>
                    <td className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      {submission.elaboration}
                    </td>
                    <td className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      {submission.appealOpenDate}
                    </td>
                    <td className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      {submission.appealCloseDate}
                    </td>
                    <td className="p-6 py-3 text-center text-xs font-medium  text-zinc-300 uppercase poppins">
                      {submission.isSuccessful ? "Successful" : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>

    </div>
  );
  
}


export default App;



  // return (
  //   <div className="App mt-32">
  //     Protocol dashboard
  //     <div>
  //       Your Trust Balance: {trustBalance}
  //     </div>
  //     {protocolInstance != "0x0000000000000000000000000000000000000000" ?
  //       <>
  //         <div> Your Pool Address: {protocolInstance} </div>
  //         <div> Your staked Trust: {totalTrustStaked} </div>
  //         <div> Your staked Eth : {totalEthStaked} WEI </div>
  //         <div> Your collateral size: {collateralSize} WEI </div> 
  //         {/* Input for Stake */}
  //         { approved ? 
  //         <>
  //         <div>
  //             <input 
  //               type="number" 
  //               placeholder="Amount of Trust to Stake" 
  //               value={stakeTrustAmount}
  //               onChange={(e) => setStakeTrustAmount(Number(e.target.value))}
  //             />
  //             <button onClick={stake}> Stake Trust to increase the size of your pool</button>
  //         </div>

  //           {/* Input for Fund Pool */}
  //         <div>
  //           <input 
  //             type="number" 
  //             placeholder="Amount of Eth to Fund" 
  //             value={ethAmount}
  //             onChange={(e) => setEthAmount(Number(e.target.value))}
  //           />
  //           <button onClick={fundPool}> Fund Pool in Wei</button>
  //         </div>
  //         </> : 
  //         <button onClick={approve}> Approve </button>}
  //       </> 
  //       :
  //       <button onClick={createProtocolPool}> Create Protocol Pool</button>
  //     }

  //   </div>
  // );