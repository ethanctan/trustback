import {Juror} from "../dbinterface/juror"


interface AllocationScInterface{
    
    allocateJuror(jurorList : Juror[], jurorNo ?: number) : string[]
}



export {AllocationScInterface}