import {
    DrivingSchool,
    ErrorCompanyNotFound,
    ErrorInvalidEmail,
    ErrorInvalidPhoneNumber,
    type User,
    type Admin,
    type CompanyId,
    type DrivingSchoolFingerprint,
    type DrivingSchoolId,
    type DrivingSchoolOpeningHours,
    type ForCreatingADrivingSchool,
} from "@crenauto/domain"
import { err, type Result } from "@crenauto/error"
import type { ForGeneratingAnId } from "../ForGeneratingAnId"
import type { ForManagingDates } from "../ForManagingDates"
import { RoleService } from "libs/domain/src/services/RoleService"

export type DrivingSchoolToCreateCommand = {
    companyId?: string
    name: string
    address: {
        street: string
        city: string
        zipCode: string
        country: string
    }
    phone: string
    email: string
    openingHours: DrivingSchoolOpeningHours
}

export class CreateADrivingSchoolUseCase {
    constructor(
        private drivingSchoolRepository: ForCreatingADrivingSchool,
        private idProvider: ForGeneratingAnId,
        private dateProvider: ForManagingDates
    ) {}

    async execute(
        user: User,
        drivingSchoolToCreate: DrivingSchoolToCreateCommand
    ): Promise<
        Result<
            DrivingSchool,
            ErrorInvalidPhoneNumber | ErrorInvalidEmail | ErrorCompanyNotFound
        >
    > {
        if (!RoleService.isAdminOrDirector(user)) {
            return err(new ErrorNotAuthorizedToCreateADrivingSchool())
        }

        const companyId = RoleService.isAdmin(user)
            ? drivingSchoolToCreate.companyId
            : user.data.relatedCompany

        const drivingSchool = DrivingSchool.fromData({
            id: this.idProvider.generate() as DrivingSchoolId,
            fingerPrint:
                this.idProvider.generateFingerPrint() as DrivingSchoolFingerprint,
            companyId: companyId as CompanyId,
            name: drivingSchoolToCreate.name,
            address: drivingSchoolToCreate.address,
            phone: drivingSchoolToCreate.phone,
            email: drivingSchoolToCreate.email,
            openingHours: drivingSchoolToCreate.openingHours,
            createdAt: this.dateProvider.now(),
            updatedAt: this.dateProvider.now(),
        })

        if (drivingSchool.isErr()) {
            return drivingSchool
        }

        const newDrivingSchool = await this.drivingSchoolRepository.create(
            drivingSchool.value
        )

        if (newDrivingSchool.isErr()) {
            return newDrivingSchool
        }

        return newDrivingSchool
    }
}

export class ErrorNotAuthorizedToCreateADrivingSchool extends Error {}
