import { ContractTransaction } from 'ethers';

export interface IDisputeFee {
    trustToken(): Promise<string>;
    owner(): Promise<string>;
    generalStaking(): Promise<string>;
    disputeCount(): Promise<number>;

    reward(_amountTrust: number, _amountEth: number, _recipient: string, _disputeCount: number): Promise<ContractTransaction>;

    transferSlash(_disputeCount: number, _juror: string): Promise<ContractTransaction>;

    viewDisputeFeeEth(_disputeCount: number): Promise<number>;
    viewDisputeFeeTrust(_disputeCount: number): Promise<number>;
}

