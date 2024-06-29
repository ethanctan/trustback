import {Juror} from "./juror"

class Preferences {
    industryPreference : Map<string, number>
    education : Map<string, string>
    certification : string[]

}

type Dispute = {

}

class Protocol {
    preference : Preferences
    stake : number
    disputes : Dispute[]
    addresses : string[]
}

interface ProtocolDbInterface{

    findByProtocol(protocolName : string) : Protocol

    addProtocol(protocol : Protocol) : void

    findByJuror(juror : string) : Protocol[]

}

export {Protocol, ProtocolDbInterface}