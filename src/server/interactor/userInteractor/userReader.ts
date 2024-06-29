import { VoteStatus } from "../../dbinterface/case.js";
import { CaseDbInterface } from "../../dbinterface/caseDbInterface.js"


type txnStatus = {
    txnHash : string;
    value : number;
    protocol : string;
    isSuccessful : VoteStatus;
    appealOpenDate : string;
    appealCloseDate : string
    elaboration : string;
} 

export default class UserReader{

    caseDbInterface : CaseDbInterface
    counter  : number

    constructor(){
        this.counter = 0
    }

    getUser(userWallet : string) : txnStatus[] {
        this.counter += 1;
        let voteStatus = VoteStatus.inProgress
        if (this.counter >= 6){
            voteStatus = VoteStatus.accepted
        }
        return [{
            txnHash: "0x123",
            value : 0.1,
            protocol : "Uniswap",
            elaboration : "LP contract got exploited",
            isSuccessful : voteStatus,
            appealOpenDate : "122022",
            appealCloseDate : "122023"
        }]
    }
}

