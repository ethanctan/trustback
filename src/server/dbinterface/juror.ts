class Qualifications {
    industryExperience : Map<string, number>
    education : string[][]
    certifications : string[]

    constructor(){
        this.industryExperience = new Map()
        this.education = []
        this.certifications = []
    }

    setCertifications(certifications : string[]){
        this.certifications = certifications
    }

    setEducation(education : string[][]){
        this.education = education
    }

    setIndustryExperience(industryExperience : Map<string, number>){
        this.industryExperience = industryExperience;
    }

    setIndustryExperienceList(experience : any[][]){
        for (let i = 0; i < experience.length; i++){
            this.industryExperience.set(experience[i][0], experience[i][1])
        }
    }

}

class Juror {
    private walletId : string;
    isDoxed : boolean;
    email : string;
    qualifications : Qualifications;

    constructor(walletId : string, isDoxed : boolean){
        this.walletId = walletId;
        this.isDoxed = isDoxed;
    }

    getWalletId(){
        return this.walletId
    }

    setQualification(){

    }

    isNull(){
        return false
    }

}

class EmptyJuror extends Juror {

    constructor(){
        super("", false)
    }

    isNull(): boolean {
        return true
    }
}

export {Juror, EmptyJuror, Qualifications}
