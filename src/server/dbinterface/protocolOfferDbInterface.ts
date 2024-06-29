import { Juror } from "./juror";
import { Protocol } from "./protocolDbinterface";


type Offer = {
    jurorId : string;
    protocol : string;
    isOptedIn : boolean
}

interface ProtocolOfferDbInterface{

    findOffersByProtocol(protocol : string) : Offer[]

    findOffersByJuror(jurorId : string) : Offer[]

    findOffer(jurorId : string, protocol : string) : Offer

    updateOffer(jurorId : string, protocol : string, isOptedIn : boolean) : Offer

    addOffer(jurorId : string, protocol : string) : void

    removeOffer(jurorId : string, protocol : string) : void
}

export {Offer, ProtocolOfferDbInterface}