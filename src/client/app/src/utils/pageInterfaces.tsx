export interface IDisputeForm {
    submitFee: () => void;
    pending: boolean;
}

export interface IJurorProfile {
    jurorWalletAddress: string;
    jurorStakedAmount: number;
}