import { DisputeInfo, EmptyDisputeInfo } from "./disputeInfo";


enum VoteStatus {
    inProgress = 0,
    accepted = 1,
    rejected = -1
}


class JurorDecisions{
    private jurorDecisions : Map<string, VoteStatus>;

    constructor(){
        this.jurorDecisions = new Map()
    }

    addJuror(jurorId : string, voteStatus ?: VoteStatus) : boolean {
        if (this.jurorDecisions.has(jurorId)){
            return false
        }
        let vote = voteStatus ? voteStatus : VoteStatus.inProgress
        this.jurorDecisions.set(jurorId, vote)
        return true
    }


    updateJurorVote(jurorId : string, voteStatus : VoteStatus) : boolean{
        if (!this.jurorDecisions.has(jurorId) || 
            this.jurorDecisions.get(jurorId) != VoteStatus.inProgress){
            return false
        }
        this.jurorDecisions.set(jurorId, voteStatus)
        return true
    }

    removeJuror(jurorId : string){
        return this.jurorDecisions.delete(jurorId)
    }

    getNumVoted(){
        let numVoted = 0
        this.jurorDecisions.forEach((value: VoteStatus, key: string) => {
            if (value != VoteStatus.inProgress){
                numVoted += 1
            }
        });
        return numVoted
    }

    getOverallVote() : VoteStatus{
        this.jurorDecisions.forEach((value: VoteStatus, key: string) => {
            if (value == VoteStatus.inProgress){
                return VoteStatus.inProgress
            }
        });
        return Math.max(...this.jurorDecisions.values())
    }

    getJurors() : Map<string, VoteStatus>{
        return this.jurorDecisions
    }

    getJurorCount() : number{
        return this.jurorDecisions.size
    }

}

class DisputeCase {
    private caseId : string
    private dispute : DisputeInfo

    constructor(caseId : string, dispute : DisputeInfo){
        this.caseId = caseId
        this.dispute = dispute
    }

    getCaseId() : string{
        return this.caseId
    }

    getDispute() : DisputeInfo{
        return this.dispute
    }

    isNull() : boolean {
        return false
    }

}

class EmptyDisputeCase extends DisputeCase {

    constructor(){
        super("", new EmptyDisputeInfo())
    }

    isNull() : boolean {
        return true
    }
}

export { VoteStatus, JurorDecisions, DisputeCase, EmptyDisputeCase }