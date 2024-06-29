import React, { useState } from 'react'; 

// interface
import { IDisputeForm } from '../../utils/pageInterfaces';

// My components
import QuestionTitle from "../../components/questiontitle"
import Button from '../../components/button';

// Chakra components
import { Input, NumberInput, NumberInputField } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

// Thirdweb
import { useAddress, useSigner } from "@thirdweb-dev/react";

// Import API endpoint
const API_URL = import.meta.env.VITE_API_URL

export default function DisputeForm({ submitFee, pending }: IDisputeForm) {

    // Define state variables to store form data
    const [txnHash, setTxnHash] = useState('');
    const [disputeFee, setDisputeFee] = useState('');
    const [amount, setAmount] = useState('');
    const [gasCost, setGasCost] = useState(0); // probably remove this
    const [recipient, setRecipient] = useState('');
    const [textEvidence, setTextEvidence] = useState('');
    const [email, setEmail] = useState('');
    const sender = useAddress();

    const handleSubmit = async () => {

        // pay on-chain fee
        await submitFee();

        const disputeForm = {
            dispute: {
            txnHash, // done
            textEvidence, // done
            sender, // done
            recipient, // done
            amount: parseFloat(amount), // done
            },
            email, // done
            disputeFee: 0, // TODO: how to set fee
            gasCost, // TODO: get brandon to remove this
            // TODO: add field for currency type
        };

        try {
            // Send a POST request to your backend endpoint with the disputeForm data
            const response = await fetch(`${API_URL}/user/form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(disputeForm),
            });

            if (response.ok) {
            // Handle successful submission (e.g., show a success message)
            console.log('Form submitted successfully');
            } else {
            // Handle error response from the server
            console.error('Form submission failed');
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="bg-slate-800 shadow-2xl shadow-indigo-500/80 p-5 rounded-lg max-w-xl mt-32">
            <div className="poppins font-medium mb-3 text-left"> Submit Dispute </div>

            <div className="bg-slate-900 p-5 rounded-md poppins flex-col space-y-4">
                <QuestionTitle 
                    title="Transaction Hash" 
                    subtitle="List the most relevant transaction. If more than one transaction is relevant, include the rest in the 'elaboration' field." 
                />

                <Input 
                    placeholder="0x..."
                    value={txnHash}
                    onChange={(e) => setTxnHash(e.target.value)}
                />

                <QuestionTitle 
                    title="Value Disputed" 
                    subtitle="The value of the chargeback you're requesting. If this differs from the transaction amount, it would help to include an explanation in the 'elaboration' field." 
                />

                <div className="flex flex-row space-x-5">
                    <NumberInput>
                        <NumberInputField 
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </NumberInput>

                    <Select placeholder='Currency'>
                        <option value='option1'>ETH</option>
                    </Select>
                </div>


                <QuestionTitle 
                    title="Protocol" 
                    subtitle="The protocol involved in the transaction. Only protocols that have integrated TRUSTBACK are shown." 
                />

                <Select 
                    placeholder='Protocol'
                    onChange={e => setRecipient(e.target.value)}
                >
                    <option value='option1'>Uniswap</option>
                    <option value='option2'>Maker</option>
                </Select>

                {/* <QuestionTitle 
                    title="Evidence" 
                    subtitle="Upload any files relevant to this dispute - e.g. screenshots, receipts, emails, etc." 
                />

                <div className="bg-slate-300/20 rounded-md p-4">
                    Upload
                </div> */}


                <QuestionTitle 
                    title="Elaboration" 
                    subtitle="Explain why you believe this transaction warrants a chargeback." 
                />
                
                <Textarea 
                    placeholder='Provide context, explain your evidence, and include any additional relevant transactions or accounts...' 
                    value={textEvidence}
                    onChange={(e) => setTextEvidence(e.target.value)}
                />

                <QuestionTitle 
                    title="Email (Optional)" 
                    subtitle="If you'd like to receive notifications on your dispute status." 
                />

                <Input 
                    placeholder="vitalik@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button text="Submit" onClick={handleSubmit} pending={pending}></Button>

            </div>
        </div>
    )

}