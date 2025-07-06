import type { ForCreatingACompany } from "./ForCreatingACompany"
import type { ForEditingACompany } from "./ForEditingACompany"
import type { ForRetrievingACompany } from "./ForRetrievingACompany"
import type { ForRetrievingCompanies } from "./ForRetrievingCompanies"
import type { ForRetrievingDrivingSchoolsOfACompany } from "./ForRetrievingDrivingSchoolsOfACompany"

export interface IManageCompanies
    extends ForCreatingACompany,
        ForEditingACompany,
        ForRetrievingACompany,
        ForRetrievingCompanies,
        ForRetrievingDrivingSchoolsOfACompany {}
