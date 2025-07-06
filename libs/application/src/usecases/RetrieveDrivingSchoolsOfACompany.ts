import {
    DrivingSchool,
    RoleService,
    type CompanyId,
    type ForRetrievingDrivingSchoolsOfACompany,
    type User,
} from "@crenauto/domain"
import { err, ok, type Result } from "@crenauto/error"

export class RetrieveDrivingSchoolsOfACompanyUseCase {
    constructor(
        private companyRepository: ForRetrievingDrivingSchoolsOfACompany
    ) {}

    async execute(
        user: User,
        companyId: CompanyId
    ): Promise<
        Result<
            DrivingSchool[],
            ErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompany
        >
    > {
        if (!RoleService.isAdminOrDirector(user)) {
            return err(
                new ErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompany()
            )
        }

        const userCompanyId = RoleService.isAdmin(user)
            ? companyId
            : user.data.relatedCompany as CompanyId

        const drivingSchools =
            await this.companyRepository.getDrivingSchoolsOfACompany(userCompanyId)

        return ok(drivingSchools)
    }
}

export class ErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompany extends Error {
    name = "ErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompany"

    constructor(message?: string) {
        super(
            message || "Not authorized to retrieve driving schools of a company"
        )
    }
}
