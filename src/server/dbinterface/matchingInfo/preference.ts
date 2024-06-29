import { Qualification, WorkHistory, Education, Certifications } from "./qualification"


interface Preference {
    checkQualificationValid(qualification : Qualification) : boolean

    updatePreference(preference : any) : void
}

class NoPreference implements Preference{
    checkQualificationValid(qualification: Qualification): boolean {
        return true
    }
    updatePreference(preference: Preference): void {}
}


class WorkPreference implements Preference{

    requirements : Map<string, number>

    checkQualificationValid(qualification: WorkHistory): boolean {
        return true
    }
    updatePreference(preference: WorkPreference): void {
        this.requirements = preference.requirements
    }
    addPreference(industry : string, yoe : number){
        this.requirements.set(industry, yoe)
    }
}

class EducationPreference implements Preference {
    educationPreferences : Map<string, string>

    checkQualificationValid(qualification: Education): boolean {
        return true
    }
    updatePreference(preference: EducationPreference): void {
        this.educationPreferences = preference.educationPreferences
    }
    
}

class CertificationPreference implements Preference{
    certificationPreferences : string[]
    checkQualificationValid(qualification: Certifications): boolean {
        return true
    }
    updatePreference(preference: CertificationPreference): void {
        this.certificationPreferences = preference.certificationPreferences
    }
}


export {Preference}