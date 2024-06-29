import { DisputeInfo } from "./disputeInfo";
import { VoteStatus } from "./case";
import { Juror } from "./juror";
import { PostgresDb } from "./pgDb";


type CaseDetail =  {
    jurorId : string
    caseId : string
    vote : VoteStatus
}

interface CaseDetailsDbInterface{

    findCasesByJuror(jurorId : string) : CaseDetail[]

    findJurorsByCase(caseId : string) : CaseDetail[]

    addCaseDetail(jurorId : string, caseId : string, vote : VoteStatus) : void

}


class PgCaseDetailDb extends PostgresDb implements CaseDetailsDbInterface{

    findCasesByJuror(jurorId: string): CaseDetail[] {
        
    }

    findJurorsByCase(caseId: string): CaseDetail[] {
        
    }

    addCaseDetail(jurorId: string, caseId: string, vote: VoteStatus): void {
        
    }
}

export {CaseDetailsDbInterface, CaseDetail}