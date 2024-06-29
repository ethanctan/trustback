import { ContractTransaction } from 'ethers';

export interface IProtocolPoolGen {
    trustToken(): Promise<string>;
    owner(): Promise<string>;

    createPool(): Promise<ContractTransaction>;
    viewPoolAddress(_address: string): Promise<string>;
    callChargeBack(_protocol: string, _recipient: string, _amount: number): Promise<ContractTransaction>;
}
