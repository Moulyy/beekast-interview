import type {
    Admin,
    CompanyFingerprint,
    CompanyId,
    CreateCompanyFromDataErrors,
    ForCreatingACompany,
    User,
} from "@crenauto/domain"
import { Company } from "@crenauto/domain"
import { err, ok } from "@crenauto/error"
import type { Result } from "@crenauto/error"
import type { ForGeneratingAnId } from "../ForGeneratingAnId"
import type { ForManagingDates } from "../ForManagingDates"
import { RoleService } from "libs/domain/src/services/RoleService"

export type CompanyToCreateCommand = {
    name: string
    address: {
        street: string
        city: string
        zipCode: string
        country: string
    }
    legalStatus: string
    contact: {
        phone: string
        email: string
    }
}

export class CreateACompanyUseCase {
    constructor(
        private companyRepository: ForCreatingACompany,
        private idProvider: ForGeneratingAnId,
        private dateProvider: ForManagingDates
    ) {}

    async execute(
        companyToCreate: CompanyToCreateCommand,
        admin: User
    ): Promise<
        Result<
            Company,
            CreateCompanyFromDataErrors | ErrorNotAuthorizedToCreateACompany
        >
    > {
        if (!RoleService.isAdmin(admin)) {
            return err(new ErrorNotAuthorizedToCreateACompany())
        }

        const newCompany = Company.fromData({
            id: this.idProvider.generate() as CompanyId,
            fingerprint:
                this.idProvider.generateFingerPrint() as CompanyFingerprint,
            name: companyToCreate.name,
            address: companyToCreate.address,
            legalStatus: companyToCreate.legalStatus,
            contact: {
                phone: companyToCreate.contact.phone,
                email: companyToCreate.contact.email,
            },
            createdAt: this.dateProvider.now(),
            updatedAt: this.dateProvider.now(),
        })

        if (newCompany.isErr()) {
            return newCompany
        }

        // TODO: hadnle the case where the company is created but the repository fails and its errors
        return ok(await this.companyRepository.create(newCompany.value))
    }
}

export class ErrorNotAuthorizedToCreateACompany extends Error {}
