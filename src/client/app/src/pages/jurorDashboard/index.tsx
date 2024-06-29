import '../../App.css';
import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import { getJurorWalletInstance } from '../../utils/ethers';
import pendingCheck from '../../components/pendingCheck';
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

// Form components
import JurorProfile from './jurorProfile';

// .env variables
const API_URL = import.meta.env.VITE_API_URL

//@ts-ignore
export default function App({account, contracts, balance, passPendingState, jurorWallet, provider, signer}) {
  const admin = "0x8066221588691155A7594291273F417fa4de3CAe"
  const [jurorAccount, setJurorAccount] = useState("");
  const [jurorSigner, setJurorSigner] = useState<ethers.Signer | null>(null);
  const [baseContracts, setBaseContracts] = useState<{trust: ethers.Contract, generalStaking: ethers.Contract, disputeFee: ethers.Contract, jurorWalletGen: ethers.Contract, protocolPoolGen: ethers.Contract} | null>(null);
  const [trustBalance, setTrustBalance] = useState("");
  const [pending, setPending] = useState(false);
  const [jurorInstance, setJurorInstance] = useState("");
  const [jurorStakedAmount, setJurorStakedAmount] = useState("");
  const [jurorContract, setJurorContract] = useState<{jurorWallet: ethers.Contract} | null>(null);

  useEffect(() => {
    async function setupContracts() {
        console.log("Juror Dashboard");
        setJurorAccount(account);
        setJurorSigner(signer);
        setBaseContracts(contracts);
        setTrustBalance(balance.balance);
        setJurorInstance(jurorWallet);
        setJurorStakedAmount(balance.staked);
        {jurorWallet != "0x0000000000000000000000000000000000000000" ? 
        setJurorContract(await getJurorWalletInstance(signer, jurorWallet)) :
        null}
        console.log("account: ", account);
        console.log("signer: ", signer);
        console.log("contract: ", contracts);
        console.log("balance: ", balance);
        console.log("juror wallet: ", jurorWallet);
        console.log("juror wallet contract: ", await getJurorWalletInstance(signer, jurorWallet));
    }
    setupContracts();
}, [account, contracts, balance, jurorWallet]);

  const createJurorWallet = async () => {
    passPendingState(true);
    setPending(true);
    const tx = await baseContracts?.jurorWalletGen.createJurorWallet();
    await pendingCheck({txHash: tx.hash, provider: provider})
    //update paramters
    passPendingState(false);
    setPending(false);
    setJurorInstance(baseContracts?.jurorWalletGen.viewJurorWalletAddress(account));
    console.log("jurorwallet: ", baseContracts?.jurorWalletGen.viewJurorWalletAddress(account));
    setJurorContract(await getJurorWalletInstance(jurorInstance,jurorSigner));
    console.log("juror wallet contract instantiated: ", await getJurorWalletInstance(jurorSigner, jurorWallet))
  }

  // handlesubmit button that calls vote
  const handleButtonDemo = async () => {
    await vote(1, Math.floor(Math.random() * 100));
  };


  const vote = async (userVote: number, caseNumber: number) => {
    if (userVote == 1 || userVote == 2) {
      passPendingState(true);
      setPending(true);
      let salt = 1234;
      const tx = await jurorContract?.jurorWallet.addHash(caseNumber, salt);
      const tx2 = await jurorContract?.jurorWallet.commit(caseNumber, salt, userVote);
      await pendingCheck({ txHash: tx.hash, provider: provider });
      await pendingCheck({ txHash: tx2.hash, provider: provider });
      passPendingState(false);
      setPending(false);
    } else {
      console.log("Invalid vote");
    }
  };
  
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

  // Ethan TODO: show total staked 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-32 mb-32">
      { Number(jurorStakedAmount) >= 10000 ? 
       jurorWallet == "0x0000000000000000000000000000000000000000" ?
      <button onClick={createJurorWallet}> create juror wallet </button> :
      <JurorProfile jurorWalletAddress={jurorInstance} jurorStakedAmount={parseInt(jurorStakedAmount)}/> :
      <div className="flex-col">
        <div className="bg-red-900/70 p-5 rounded-lg poppins max-w-xl mb-5">
          Please {" "}
          <a 
                href="/stake"
                rel="noopener noreferrer"
                className="text-left poppins underline text-blue-300 hover:text-blue-400"
            > 
                stake
          </a>
          {" "} at least 10000 $TRUST to participate in the jury. You have only staked {jurorStakedAmount}. 
        </div>
        <JurorProfile jurorWalletAddress={jurorInstance} jurorStakedAmount={parseInt(jurorStakedAmount)} />
      </div>
      }

      
      {jurorContract ?  // TODO after Saturday: Abstract this
        <>
          <div className="text-lg poppins font-medium mb-4 mt-16"> Pending Disputes </div>
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
                        Vote
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
                        
                      <div className="flex h-12 items-center rounded-lg transition-all duration-100 poppins">
                        <select
                          className="border-white border-2 w-full h-full flex-1 px-4 py-full bg-gray-900 transition-all duration-100 rounded-l-lg bg-transparent border border-transparent group text-sm"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>

                        <span className="relative inline-flex h-full poppins">
                          <button
                            onClick={handleButtonDemo}
                            className="relative h-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-r-lg group bg-gradient-to-br from-purple-600 to-blue-500 text-zinc-300 shadow-lg shadow-purple-800/40 w-36"
                          >
                            <span className="relative h-full px-5 py-3 transition-all ease-in duration-75 bg-slate-900 rounded-r-md group-hover:bg-opacity-0 w-36">
                              Vote
                            </span>
                          </button>
                        </span>
                      </div>



                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        : null}

    </div>
  );
}


