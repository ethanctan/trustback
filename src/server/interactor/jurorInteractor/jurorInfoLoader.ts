import { CaseDbInterface } from "../../dbinterface/caseDbInterface";
import { JurorDbInterface } from "../../dbinterface/jurorDbInterface";
import { DisputeInfo } from "../../dbinterface/disputeInfo";
import { Offer, ProtocolOfferDbInterface } from "../../dbinterface/protocolOfferDbInterface";
import { CaseDetailsDbInterface, CaseDetail } from "../../dbinterface/caseDetailsDbInterface";
import { VoteStatus } from "../../dbinterface/case";

class JurorInfoLoader{

    jurorDbInterface : JurorDbInterface
    caseDbInterface : CaseDbInterface
    protocolOfferDbInterface : ProtocolOfferDbInterface
    caseDetailDbInterface : CaseDetailsDbInterface

    /***
     * Returns a json object of the form
     * {
     * jurorWallet
     * elegibleProtocols : []
     * standbyProtocols : {
     * }
     * pendingDisputes : {
     * }
     * ongoingDisputes : {
     * }
     * }
     */
    getJurorInfo(jurorId : string){
        let juror = this.jurorDbInterface.findById(jurorId);
        
        let protocolOffers : Offer[] = this.protocolOfferDbInterface.findOffersByJuror(jurorId)
        let disputeList = this.getCases(jurorId)

        return{
            jurorWallet : juror,
            protocols : protocolOffers,
            pendingDisputes : disputeList[0],
            ongoingDisputes : disputeList[1]
        }
    }

    getCases(jurorId : string) : DisputeInfo[][] {
        let caseList : CaseDetail[] = this.caseDetailDbInterface.findCasesByJuror(jurorId)
        let pendingDisputeList : DisputeInfo[] = []
        let ongoingDisputeList : DisputeInfo[] = []
        for (let i = 0; i < caseList.length; i++){
            let caseId = caseList[i].caseId
            let dispute = this.caseDbInterface.getCaseById(caseId)
            if (caseList[i].vote == VoteStatus.inProgress){
                ongoingDisputeList.push(dispute)
            }else{
                pendingDisputeList.push(dispute)
            }
            
        }

        return [ongoingDisputeList, pendingDisputeList]
    }




    getCaseList(caseIdList : Set<string>){
        let caseList : DisputeInfo[] = []
        for (let caseId of caseIdList){
            let caseObj = this.caseDbInterface.getCaseById(caseId)
            caseList.push(caseObj)
        }
        return caseList
    }
}