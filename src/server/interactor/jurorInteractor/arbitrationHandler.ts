import { VoteStatus } from "../../dbinterface/case"
import { CaseDbInterface } from "../../dbinterface/caseDbInterface"
import { CaseDetailsDbInterface } from "../../dbinterface/caseDetailsDbInterface"
import { JurorDbInterface } from "../../dbinterface/jurorDbInterface"



class ArbitrationHandler {

    caseDbInterface : CaseDbInterface
    jurorDbInterface : JurorDbInterface
    caseDetailDbInterface : CaseDetailsDbInterface


    handleCase(caseId : string, jurorId : string, vote : VoteStatus) : boolean{
        this.caseDetailDbInterface.addCaseDetail(caseId, jurorId, vote)
        
        return true
    }
}