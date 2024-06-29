import { ContractTransaction } from 'ethers';

export interface IProtocolPool {
    trustToken(): Promise<string>;
    owner(): Promise<string>;
    genOwner(): Promise<string>;
    stakingRatio(): Promise<number>;
    totalStakedEth(): Promise<string>; // Note: It's a string because big numbers are typically represented as strings in JavaScript.

    stake(_amount: number): Promise<ContractTransaction>;
    withdraw(_amount: number): Promise<ContractTransaction>;
    
    // Since TypeScript doesn't have a special type for payable functions, this is typically represented by a send or a similar method in ethers or web3 libraries
    // For instance, using ethers.js, you might call this function with something like contract.sendTransaction({ value: ... })

    chargeback(_amount: number, _address: string): Promise<ContractTransaction>;
    calculateMaxEth(): Promise<string>; // Returns as string due to big number representation
    viewStakedEth(): Promise<string>; // Returns as string due to big number representation
}
