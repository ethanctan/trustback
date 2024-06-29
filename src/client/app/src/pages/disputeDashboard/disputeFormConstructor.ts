


class DisputeInfo{
    readonly txnHash : string;
    textEvidence : string;
    readonly sender : string;
    readonly recipient : string;
    amount : number;    
    
    constructor(sender : string, recipient : string, txnHash : string){
        this.sender = sender
        this.recipient = recipient
    }
}


class DisputeForm{
    dispute : DisputeInfo
    email ?: string
    disputeFee : number
    gasCost : number
}

class DisputeFormConstructor{

    blockExplorer : BlockExplorer;

    constructor(blockExplorer : BlockExplorer){
        this.blockExplorer = blockExplorer
    } 

    async makeDisputeForm(txnHash : string, email ?: string){
        let txnInfo = await this.blockExplorer.findTransactionByTxnHash(txnHash);
        let disputeInfo = new DisputeInfo(txnInfo.from, txnInfo.to, txnHash)

        disputeInfo.amount = txnInfo.value

        let disputeForm = new DisputeForm()
        disputeForm.email = email
        disputeForm.dispute = disputeInfo

        return disputeInfo
    }


}