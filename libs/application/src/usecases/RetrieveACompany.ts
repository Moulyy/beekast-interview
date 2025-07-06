import {
    ErrorNotFound,
    User,
    RoleService,
    type Company,
    type CompanyId,
    type ForRetrievingACompany,
} from "@crenauto/domain"
import { err, ok, type Result } from "@crenauto/error"

export class RetrieveACompanyUseCase {
    constructor(private companyRepository: ForRetrievingACompany) {}

    async execute(
        admin: User,
        companyId: CompanyId
    ): Promise<Result<Company, Error>> {
        try {
            if (!RoleService.isAdmin(admin)) {
                return err(new ErrorNotAuthorizedToRetrieveACompany())
            }

            const company = await this.companyRepository.getById(companyId)

            if (company === undefined) {
                return err(new ErrorNotFound())
            }

            return ok(company)
        } catch (error) {
            if (error instanceof Error) return err(error)
            throw error
        }
    }
}

export class ErrorNotAuthorizedToRetrieveACompany extends Error {}
