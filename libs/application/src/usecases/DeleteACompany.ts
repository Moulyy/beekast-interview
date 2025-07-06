import {
    User,
    type Admin,
    type CompanyId,
    type ForDeletingACompany,
} from "@crenauto/domain"
import { err, ok, type Result } from "@crenauto/error"
import { RoleService } from "libs/domain/src/services/RoleService"

export class ErrorNotAuthorizedToDeleteACompany extends Error {}

export class SuccesfullyDeletedACompany {}

export class DeleteACompanyUseCase {
    constructor(private companyRepository: ForDeletingACompany) {}

    async execute(
        currentUser: User,
        companyId: CompanyId
    ): Promise<Result<SuccesfullyDeletedACompany, Error>> {
        try {
            // TODO: See why it doesn't pass the test
            if (!RoleService.isAdmin(currentUser)) {
                return err(new ErrorNotAuthorizedToDeleteACompany())
            }

            await this.companyRepository.delete(companyId)
            return ok(new SuccesfullyDeletedACompany())
        } catch (error) {
            if (error instanceof Error) return err(error)
            throw error
        }
    }
}
