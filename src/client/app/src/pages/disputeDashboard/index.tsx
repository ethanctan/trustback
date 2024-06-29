import '../../App.css';
import {useEffect, useState} from 'react';

// ethers.js
import { ethers } from 'ethers';
import pendingCheck from '../../components/pendingCheck';
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

// components
import DisputeForm from './disputeForm';
import { SubmissionTable } from '../../components/submissionTable';

// api url
const API_URL = import.meta.env.VITE_API_URL

//@ts-ignore
function App({account, contracts, balance, passPendingState, provider, signer}) {
  const [userAccount, setUserAccount] = useState("");
  const [userContracts, setUserContracts] = useState<{trust: ethers.Contract, generalStaking: ethers.Contract, disputeFee: ethers.Contract, jurorWalletGen: ethers.Contract, protocolPoolGen: ethers.Contract} | null>(null);
  const [trustBalance, setTrustBalance] = useState("");
  const [pending, setPending] = useState(false);
  const [unlocks, setUnlocks] = useState("");

  // temp
  const [submitted, setSubmitted] = useState(false);



  useEffect(() => {
    async function setupContracts() {
        console.log("Dispute Dashboard");
        setUserAccount(account);
        setUserContracts(contracts);
        setTrustBalance(balance.balance);
        setUnlocks((await contracts.generalStaking.getMaxCount(account)).toString());
        console.log("account: ", account);
        console.log("contract: ", contracts);
        console.log("balance: ", balance);
        console.log("unlocks: ", (await contracts.generalStaking.getMaxCount(account)).toString())
    }
    setupContracts();
  }, [account, contracts, balance]);

  const submitFee = async () => {
    if (!userContracts || !userContracts.disputeFee) return;
    try {
      passPendingState(true);
      setPending(true);
      const tx = await signer.sendTransaction({
        to: userContracts.disputeFee.address,  // Assuming disputeFee is the contract instance
        value: 20000000 //Dispute fee of 0.00000000002 Eth
     });
      await pendingCheck({txHash: tx.hash, provider: provider})
      passPendingState(false);
      setPending(false);
      setSubmitted(true);

    } catch (error) {
      console.error("Error submitting fee:", error);
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
  

  return (
    <div className="flex flex-col items-center justify-center mt-16 min-h-screen">
      {
        Number(unlocks) > 0 ? 
        <DisputeForm submitFee={submitFee} pending={pending}/>
        : 
        <div className="bg-red-900/70 p-5 rounded-lg poppins shadow-lg shadow-red-500/20">
          You haven't unlocked chargebacks for any protocol. {" "}
          <a 
                href="/stake"
                rel="noopener noreferrer"
                className="text-left poppins underline text-blue-300 hover:text-blue-400"
            > 
                Stake
          </a>
           {" "} 100 $TRUST to unlock your first protocol.
        </div>
      }

      {/* <SubmissionTable 
          TODO after saturday: Implement this abstraction
      /> */}

      { submitted ?
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
      : null}
    </div>
 );
}


export default App;
