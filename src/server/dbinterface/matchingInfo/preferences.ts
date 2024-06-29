import { Qualification, QualificationType, EmptyQual } from "./qualification";
import { Preference } from "./preference";

class Preferences {
    preferenceList : Map<QualificationType, Preference>

    checkQualificationsAreValid(qualifications : Qualifications) : boolean {
        for (let [k, preference] of this.preferenceList){
            let qualification = qualifications.getQualification(k)
            let isSatisfied = preference.checkQualificationValid(qualification)
            if (!isSatisfied){
                return false
            }
        }
        return true
    }

    

    
}


class Qualifications {
    qualificationList : Map<QualificationType, Qualification>

    getQualification(qualType : QualificationType) : Qualification{
        let qual = this.qualificationList.get(qualType)
        if(qual == null){
            return new EmptyQual()
        }
        return qual
    }

    addQualification(qualificationType : QualificationType, qualification : any){
        let qual = this.qualificationList.get(qualification)
        if (qual == null){
            this.qualificationList.set(qualificationType, qualification)
            return
        }
        qual.addQualification(qualification)
    }
}

export {Preferences, Qualifications}