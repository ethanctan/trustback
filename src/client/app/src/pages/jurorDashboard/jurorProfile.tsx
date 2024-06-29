import React, { useState, useEffect } from 'react'; 

// interface
import { IJurorProfile } from '../../utils/pageInterfaces';

// My components
import QuestionTitle from "../../components/questiontitle"
import Button from '../../components/button';

// Chakra components
import { Input, NumberInput, NumberInputField } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

// Thirdweb
import { useAddress, useSigner } from "@thirdweb-dev/react";

// Import API endpoint
const API_URL = import.meta.env.VITE_API_URL


export default function JurorProfile({ jurorWalletAddress, jurorStakedAmount }: IJurorProfile) {

    // Define state variables to store form data
        // State variables for juror info
    const walletId = useAddress();
    const [isDoxed, setIsDoxed] = useState(false);
    const [email, setEmail] = useState("");
    const [qualifications, setQualifications] = useState({
        industryExperience: new Map(),
        education: new Map(),
        certifications: []
    });


        // State variables for dispute form

    // Define a function to get juror info
    const getJurorInfo = async () => {
        // Send a GET request to your backend endpoint
        const response = await fetch(`${API_URL}/juror/info/${walletId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Handle successful response from the server
            const data = await response.json();
            console.log(data);

            // Update state variables
            setIsDoxed(data.isDoxed);
            setEmail(data.email);
            setQualifications(data.qualifications);
        } else {
            // Handle error response from the server
            console.error('Juror info retrieval failed');
        }
    };

    // call getjurorinfo on load
    getJurorInfo();

    // create jurorform object
    const jurorForm = {
        walletId: walletId,
        isDoxed: isDoxed,
        email: email,
        qualifications: qualifications
    }


    // Function to submit juror info
    const handleSubmit = async () => {

        try {
            // Send a POST request to your backend endpoint with the jurorform data
            const response = await fetch(`${API_URL}/juror/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jurorForm),
            });

            if (response.ok) {
            // Handle successful submission (e.g., show a success message)
            console.log('Juror details updated successfully');
            } else {
            // Handle error response from the server
            console.error('Juror details update failed');
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Juror details update error:', error);
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
        <div className="bg-slate-800 shadow-2xl shadow-indigo-500/80 p-5 rounded-lg max-w-xl">
            <div className="poppins font-medium mb-2 text-left"> Your Juror Info </div>

            <div className="poppins text-sm text-left"> Your Juror Contract Address: {" "}
                <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
                    <Link 
                        href={`https://etherscan.io/address/${jurorWalletAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-left font-mono"
                    > 
                        {jurorWalletAddress}<ExternalLinkIcon mx='2px' />
                    </Link>
                </div>
            </div>

            <div className="poppins text-sm text-left mb-3"> Your Staked Amount: 
            <div className="bg-slate-900 py-2 px-3 my-2 mx-auto rounded-md">
            {jurorStakedAmount} $TRUST 
            </div>
            
            </div>

            <div className="bg-slate-900 p-5 rounded-md poppins flex-col space-y-4">
                <QuestionTitle 
                    title="On-Chain History" 
                    subtitle="Your wallet's historical transactions with TRUSTBACK-integrated protocols." 
                />

                <div className="bg-slate-300/20 p-5 rounded-md"> None </div>

                <QuestionTitle 
                    title="Verify Credentials" 
                    subtitle="You can upload proof of real-world experience to qualify to arbitrate more protocols and increase your juror rewards." 
                />

                {!isDoxed ? 
                <div className="poppins text-sm text-left">You have not yet submitted proof of real-world experience.</div> : <></>
                }

                <div className="bg-slate-300/20 rounded-md p-4">
                    Upload
                </div>

                <QuestionTitle 
                    title="Protocols Eligible" 
                    subtitle="The protocols you are eligible to receive disputes for." 
                />

                <div className="bg-slate-300/20 p-5 rounded-md flex flex-row items-center align-center justify-between"> 
                    <div className="ml-4">Uniswap</div> 
                    <Button
                        text="Opt Out"
                    />
                </div>


                <QuestionTitle 
                    title="Email (Optional)" 
                    subtitle="If you'd like to receive notifications on new disputes received." 
                />

                <Input 
                    placeholder="vitalik@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button text="Save" onClick={handleSubmit} pending={false}></Button>

            </div>
        </div>
    )

}