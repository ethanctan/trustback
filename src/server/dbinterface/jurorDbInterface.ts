import {Juror, EmptyJuror, Qualifications} from "./juror"
import { Preference } from "./matchingInfo/preference"
import { PostgresDb } from "./pgDb"


interface JurorDbInterface{
    findById(walletId : string) : Promise<Juror>

    upsertJuror(juror : Juror) : void

    findByQualification(qualification : Qualifications) : Juror[]

    findByPreferences(preference : Preference) : Juror[]
}

class PgJurorDb extends PostgresDb implements JurorDbInterface{

    constructor(dbName ?: string){
        super("juror", dbName)
    }

    async findById(walletId : string) : Promise<Juror>{
        let jurorObj = (await this.search(`wallet = '${walletId}'`)).rows
        if (jurorObj.length == 0){
            return new EmptyJuror()
        }
        
        jurorObj = jurorObj[0]
        let juror = new Juror(walletId, jurorObj["is_doxed"])
        juror.email = jurorObj["email"]
        juror.qualifications = new Qualifications()
        juror.qualifications.setCertifications(jurorObj["certifications"])
        juror.qualifications.setEducation(this.parser.parseTupleList(jurorObj["education_history"]))

        juror.qualifications.setIndustryExperienceList(this.parser.parseTupleList(jurorObj["work_experience"]))

        return juror
    }

    createJuror(jurorObj : object){
        let juror = new Juror(jurorObj["wallet"], jurorObj["is_doxed"])
        juror.email = jurorObj["email"]

    }

    upsertJuror(juror: Juror): void {
        
    }

    findByPreferences(preference: Preference): Juror[] {
        
        throw "not implemented"
    }

    findByQualification(qualification: Qualifications): Juror[] {
        throw "not implemented"
    }
}


export {JurorDbInterface, PgJurorDb}