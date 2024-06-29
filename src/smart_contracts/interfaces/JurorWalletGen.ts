import { ContractTransaction } from 'ethers';

export interface IJurorWalletGen {
    owner(): Promise<string>;
    generalStaking(): Promise<string>;

    createJurorWallet(): Promise<ContractTransaction>;
    viewJurorWalletAddress(_address: string): Promise<string>;
}

