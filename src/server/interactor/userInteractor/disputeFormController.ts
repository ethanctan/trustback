import {CaseDbInterface} from "../../dbinterface/caseDbInterface"
import { DisputeInfo } from "../../dbinterface/disputeInfo"
import { JurorMatcher } from "../../jurorMatcher"

/**
 * Generate dispute fee
 * Select juror to arbitrate case
 * Look at protocol's juror preferences
 * Randomly pick 
 * Vote
 */
class DisputeFormController{

    dbInterface : CaseDbInterface
    jurorMatcher : JurorMatcher


    async handleDispute(disputeInfo : DisputeInfo){

    }
}