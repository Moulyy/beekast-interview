import {
    Company,
    ErrorNotFound,
    User,
    type CompanyId,
    type IManageCompanies,
} from "@crenauto/domain"
import { err, ok, type Result } from "@crenauto/error"

import type { ForManagingDates } from "../ForManagingDates"
import { RoleService } from "libs/domain/src/services/RoleService"

export type CompanyToEditCommand = Partial<
    Omit<Company["data"], "id" | "createdAt" | "updatedAt">
>

export class ErrorNotAuthorizedToEditACompany extends Error {}

export type CompanyToEditErrors =
    | ErrorNotFound
    | ErrorNotAuthorizedToEditACompany

export class EditACompanyUseCase {
    constructor(
        private companyRepository: IManageCompanies,
        private dateProvider: ForManagingDates
    ) {}

    async execute(
        companyId: CompanyId,
        companyToEdit: CompanyToEditCommand,
        admin: User
    ): Promise<Result<Company, ErrorNotAuthorizedToEditACompany>> {
        if (!RoleService.isAdmin(admin)) {
            return err(new ErrorNotAuthorizedToEditACompany())
        }

        const foundCompany = await this.companyRepository.getById(companyId)

        // TODO: have a better error handling here
        if (!foundCompany) {
            return err(
                new ErrorNotFound(
                    `Company not found with the given id: ${companyId}`
                )
            )
        }

        const editedCompany = Company.fromData({
            ...foundCompany.data,
            ...companyToEdit,
            updatedAt: this.dateProvider.now(),
        })

        if (editedCompany.isErr()) {
            return editedCompany
        }

        const editCompanyResult = await this.companyRepository.edit(
            companyId,
            editedCompany.value
        )

        return ok(editCompanyResult)
    }
}
