import { ContractTransaction } from 'ethers';

export interface IJurorWallet {
    owner(): Promise<string>;
    generalStaking(): Promise<string>;
    hasColluded(): Promise<boolean>;

    addHash(_caseNum: number, _salt: number): Promise<ContractTransaction>;

    commit(_caseNum: number, _salt: number, _vote: number): Promise<ContractTransaction>;

    addSalt(_caseNum: number, _salt: number): Promise<ContractTransaction>;

    reportCollusion(_caseNum: number, _salt: number): Promise<ContractTransaction>;

    viewVotingStatus(_caseNum: number): Promise<boolean>;

    viewParticipationStatus(_caseNum: number): Promise<boolean>;
}
