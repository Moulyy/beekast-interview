import type { Company, ForRetrievingCompanies, User } from "@crenauto/domain"
import { err, ok, type Result } from "@crenauto/error"

import { RoleService } from "libs/domain/src/services/RoleService"

export class RetrieveCompaniesUseCase {
    constructor(private companyRepository: ForRetrievingCompanies) {}

    async execute(admin: User): Promise<Result<Company[], Error>> {
        let companies: Company[] = []

        try {
            if (!RoleService.isAdmin(admin)) {
                return err(new ErrorNotAuthorizedToRetrieveCompanies())
            }
            companies = this.sortCompaniesByDescCreationDate(
                await this.companyRepository.getAll()
            )
        } catch (error) {
            if (error instanceof Error) return err(error)
        }

        return ok(companies)
    }

    private sortCompaniesByDescCreationDate(companies: Company[]): Company[] {
        return companies.sort(
            (companyA, companyB) =>
                companyB.createdAt.getTime() - companyA.createdAt.getTime()
        )
    }
}

export class ErrorNotAuthorizedToRetrieveCompanies extends Error {}
