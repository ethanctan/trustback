enum QualificationType {
    industryExperience = "industryExperience",
    education = "education",
    certifications = "certifications"
}


class Qualification{
    getValidationData() : any{
        throw "Must implement this method"
    }
    isEmpty() : boolean {
        return false
    }
    addQualification(qualification : any){
        throw "Must implement this method"
    }
}


class EmptyQual extends Qualification{
    getValidationData() {
        return ""
    }
    isEmpty() : boolean{
        return true
    }
}

class WorkHistory extends Qualification{
    
    industryExperience : Map<string, [string, string]>

    getValidationData() : Map<string, number> {
        return new Map()
    }

    
}


class Education extends Qualification {
    educationHistory : Map<string, string>

    getValidationData() : Map<string, string> {
        return this.educationHistory
    }

}

class Certifications extends Qualification{

    certifications : string[]
    
    getValidationData() {
        
    }
}







export {WorkHistory, Education, Certifications, Qualification, QualificationType, EmptyQual}