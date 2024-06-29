import { ContractTransaction } from 'ethers';

export interface IGeneralStaking {
    trustToken(): Promise<string>;
    owner(): Promise<string>;
    disputeFee(): Promise<string>;
    jurorWalletGen(): Promise<string>;

    setDisputeFee(_disputeFee: string): Promise<ContractTransaction>;
    setJurorWalletGen(_jurorWalletGen: string): Promise<ContractTransaction>;

    stake(_amount: number): Promise<ContractTransaction>;
    withdraw(_amount: number): Promise<ContractTransaction>;

    getMaxCount(_address: string): Promise<number>;
    slashJuror(_address: string): Promise<ContractTransaction>;

    transferStake(_accuser: string, _acusee: string, _acuseeWallet: string): Promise<ContractTransaction>;

    getPriority(_address: string): Promise<number>;
    viewStake(_address: string): Promise<number>;
}

