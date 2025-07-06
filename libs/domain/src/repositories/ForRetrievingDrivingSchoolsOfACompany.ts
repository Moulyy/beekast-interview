import type { CompanyId, DrivingSchool } from "../entities"

export interface ForRetrievingDrivingSchoolsOfACompany {
    getDrivingSchoolsOfACompany(companyId: CompanyId): Promise<DrivingSchool[]>
}
