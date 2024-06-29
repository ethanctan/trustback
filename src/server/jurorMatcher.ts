import { ProtocolDbInterface } from "./dbinterface/protocolDbinterface"
import { AllocationScInterface } from "./scinterface/allocationScInterface"
import { DisputeInfo } from "./dbinterface/disputeInfo"


class JurorMatcher{

    protocolDbInterface : ProtocolDbInterface
    allocationScInterface : AllocationScInterface

    /**
     * Finds jurors that satisfy disputes for the protocol
     * @param dispute 
     * @param protocol 
     */
    async findValidJurorMatches(dispute : DisputeInfo){
        let protocolName = dispute.recipient
        let protocol = this.protocolDbInterface.findByProtocol(protocolName)
        return this.allocationScInterface.allocateJuror(protocol.jurorList)
    }
}
export {JurorMatcher}