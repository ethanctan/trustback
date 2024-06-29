

class DisputeInfo{
    readonly txnHash : string;
    textEvidence : string;
    readonly sender : string;
    readonly recipient : string;
    amount : number;    
    

    constructor(json : object){
        if (
            json["sender"] == null || 
            json["recipient"] == null 
            || json["txnHash"] == null || json["amount"] == null){
                throw "invalid json object"
            }

        this.sender = json["sender"]
        this.recipient = json["recipient"]
        this.txnHash = json["txnHash"]
        this.amount = json["amount"]
    }

    isNull(){ return false }
}

class EmptyDisputeInfo extends DisputeInfo{
    constructor(){
        super({
            sender : "", recipient : "", txnHash : "", amount : ""
        })
    }

    isNull(){ return true }
}



class DisputeForm{
    dispute : DisputeInfo
    email ?: string
    disputeFee : number
    gasCost : number
}


export {DisputeInfo, DisputeForm, EmptyDisputeInfo}