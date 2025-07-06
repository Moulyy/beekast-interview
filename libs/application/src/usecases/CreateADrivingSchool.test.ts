import { beforeEach, describe, test } from "vitest"

import { Admin, Director, type CompanyId } from "@crenauto/domain"
import { keepFirstItem, keepOnlyOkValues } from "@crenauto/error"

import { CompanyBuilder } from "../test-utils/CompanyBuilder"
import { DrivingSchoolBuilder } from "../test-utils/DrivingSchoolBuilder"
import {
    createCompanyFixture,
    type CompanyFixture,
} from "../test-utils/fixtures/CompanyFixture"
import {
    createDateFixture,
    type DateFixture,
} from "../test-utils/fixtures/DateFixture"
import {
    createDrivingSchoolFixture,
    type DrivingSchoolFixture,
} from "../test-utils/fixtures/DrivingSchoolFixture"
import {
    createIdFixture,
    type IdFixture,
} from "../test-utils/fixtures/IdFixture"
import {
    createUserFixture,
    type UserFixture,
} from "../test-utils/fixtures/UserFixture"

import type { DrivingSchoolToCreateCommand } from "./CreateADrivingSchool"
import { CrenautoStorage } from "../test-utils/fixtures/Storage"

describe("Feature: Create a driving school", () => {
    let userFixture: UserFixture
    let companyFixture: CompanyFixture
    let drivingSchoolFixture: DrivingSchoolFixture
    let idFixture: IdFixture
    let dateFixture: DateFixture

    beforeEach(() => {
        const storage = new CrenautoStorage()
        userFixture = createUserFixture()
        companyFixture = createCompanyFixture({ userFixture, storage })
        idFixture = createIdFixture()
        dateFixture = createDateFixture()
        drivingSchoolFixture = createDrivingSchoolFixture({
            userFixture,
            idFixture,
            dateFixture,
            storage,
        })
    })

    describe("Scenario: The super admin can create a driving school", () => {
        test("Rule: A user that is not a super admin cannot create a driving school", async () => {
            const nonSuperAdmin = userFixture.createFakeUser({
                id: "3",
                email: "john@doe.com",
                name: "John Doe",
                password: "123456",
                role: "blabla",
            })

            userFixture.givenTheLoggedInAccountIs(nonSuperAdmin)
            await drivingSchoolFixture.whenAUserCreateADrivingSchool(
                nonSuperAdmin,
                {} as DrivingSchoolToCreateCommand
            )
            drivingSchoolFixture.thenAnErrorForUnauthorizedToCreateADrivingSchoolShouldBeCaptured()
        })

        test("Rule: A user that is a super admin can create a driving school", async () => {
            const superAdmin = Admin.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            })
            const superDriveCompanyId = "1" as CompanyId

            const drivingSchoolToCreate: DrivingSchoolToCreateCommand = {
                name: "Crenauto",
                address: {
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                },
                companyId: "1",
                phone: "+33.612345678",
                email: "super@drive.com",
                openingHours: {
                    monday: ["09:00", "18:00"],
                    tuesday: ["09:00", "18:00"],
                    wednesday: ["09:00", "18:00"],
                    thursday: ["09:00", "18:00"],
                    friday: ["09:00", "18:00"],
                    saturday: ["09:00", "19:00"],
                    sunday: [],
                },
            }

            const expectedDrivingSchool = new DrivingSchoolBuilder()
                .withId("20")
                .withFingerprint("23d902-dasf90-234dse-23efd2")
                .withName("Crenauto")
                .withAddress({
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                })
                .isAttachedToCompany(superDriveCompanyId)
                .withPhone("+33.612345678")
                .withEmail("super@drive.com")
                .withOpeningHours({
                    monday: ["09:00", "18:00"],
                    tuesday: ["09:00", "18:00"],
                    wednesday: ["09:00", "18:00"],
                    thursday: ["09:00", "18:00"],
                    friday: ["09:00", "18:00"],
                    saturday: ["09:00", "19:00"],
                    sunday: [],
                })
                .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                .withUpdatedAt(new Date("2024-07-19T01:35:00.000Z"))
                .build()

            userFixture.givenTheLoggedInAccountIs(superAdmin)
            idFixture.givenTheIdIs("20")
            idFixture.givenTheFingerPrintIs("23d902-dasf90-234dse-23efd2")
            dateFixture.givenNowIs(new Date("2024-07-19T01:35:00.000Z"))
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([createSuperDriveCompany(superDriveCompanyId)])
            )
            await drivingSchoolFixture.whenAUserCreateADrivingSchool(
                superAdmin,
                drivingSchoolToCreate
            )
            drivingSchoolFixture.thenTheCreatedDrivingSchoolShouldBe(
                keepFirstItem(keepOnlyOkValues([expectedDrivingSchool]))
            )
        })

        test(`Rule: An error should be captured when the company to attach the driving school is not found`, async () => {
            const superAdmin = Admin.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            })
            const superDriveCompanyId = "1" as CompanyId

            userFixture.givenTheLoggedInAccountIs(superAdmin)
            idFixture.givenTheIdIs("20")
            idFixture.givenTheFingerPrintIs("23d902-dasf90-234dse-23efd2")
            dateFixture.givenNowIs(new Date("2024-07-19T01:35:00.000Z"))
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([createSuperDriveCompany(superDriveCompanyId)])
            )

            await drivingSchoolFixture.whenAUserCreateADrivingSchool(
                superAdmin,
                {
                    companyId: "wrongID",
                    name: "SuperDrive Lille",
                    email: "super@drive.com",
                    phone: "+33.612345678",
                    address: {
                        street: "4922 Rue de la Paix",
                        city: "Paris",
                        zipCode: "75001",
                        country: "France",
                    },
                    openingHours: {
                        monday: ["09:00", "18:00"],
                        tuesday: ["09:00", "18:00"],
                        wednesday: ["09:00", "18:00"],
                        thursday: ["09:00", "18:00"],
                        friday: ["09:00", "18:00"],
                        saturday: ["12:00", "19:00"],
                        sunday: [],
                    },
                }
            )

            drivingSchoolFixture.thenAnErrorCompanyNotFoundShouldBeCaptured()
        })
    })

    describe("Scenario: The director of a company can create a driving school", () => {
        test(`Rule: A user that is a director of a company can create a driving school`, async () => {
            const superDriveCompanyId = "1" as CompanyId
            const director = Director.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
                relatedCompany: superDriveCompanyId,
            })

            userFixture.givenTheLoggedInAccountIs(director)
            idFixture.givenTheIdIs("20")
            idFixture.givenTheFingerPrintIs("23d902-dasf90-234dse-23efd2")
            dateFixture.givenNowIs(new Date("2024-07-19T01:35:00.000Z"))
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([createSuperDriveCompany(superDriveCompanyId)])
            )

            await drivingSchoolFixture.whenAUserCreateADrivingSchool(director, {
                companyId: superDriveCompanyId,
                name: "SuperDrive Lille",
                email: "super@drive.com",
                phone: "+33.612345678",
                address: {
                    street: "4922 Rue de la Paix",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                },
                openingHours: {
                    monday: ["09:00", "18:00"],
                    tuesday: ["09:00", "18:00"],
                    wednesday: ["09:00", "18:00"],
                    thursday: ["09:00", "18:00"],
                    friday: ["09:00", "18:00"],
                    saturday: ["12:00", "19:00"],
                    sunday: [],
                },
            })

            drivingSchoolFixture.thenTheCreatedDrivingSchoolShouldBe(
                keepFirstItem(
                    keepOnlyOkValues([
                        new DrivingSchoolBuilder()
                            .withId("20")
                            .withFingerprint("23d902-dasf90-234dse-23efd2")
                            .isAttachedToCompany(superDriveCompanyId)
                            .withEmail("super@drive.com")
                            .withPhone("+33.612345678")
                            .withName("SuperDrive Lille")
                            .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                            .withUpdatedAt(new Date("2024-07-19T01:35:00.000Z"))
                            .withAddress({
                                street: "4922 Rue de la Paix",
                                city: "Paris",
                                zipCode: "75001",
                                country: "France",
                            })
                            .withOpeningHours({
                                monday: ["09:00", "18:00"],
                                tuesday: ["09:00", "18:00"],
                                wednesday: ["09:00", "18:00"],
                                thursday: ["09:00", "18:00"],
                                friday: ["09:00", "18:00"],
                                saturday: ["12:00", "19:00"],
                                sunday: [],
                            })
                            .build(),
                    ])
                )
            )
        })

        test(`Rule: The Driving School is automatically attached to the Director's company`, async () => {
            const superDriveCompanyId = "1" as CompanyId
            const director = Director.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
                relatedCompany: superDriveCompanyId,
            })

            userFixture.givenTheLoggedInAccountIs(director)
            idFixture.givenTheIdIs("20")
            idFixture.givenTheFingerPrintIs("23d902-dasf90-234dse-23efd2")
            dateFixture.givenNowIs(new Date("2024-07-19T01:35:00.000Z"))
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([createSuperDriveCompany(superDriveCompanyId)])
            )

            await drivingSchoolFixture.whenAUserCreateADrivingSchool(director, {
                companyId: "a random id",
                name: "SuperDrive Lille",
                email: "super@drive.com",
                phone: "+33.612345678",
                address: {
                    street: "4922 Rue de la Paix",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                },
                openingHours: {
                    monday: ["09:00", "18:00"],
                    tuesday: ["09:00", "18:00"],
                    wednesday: ["09:00", "18:00"],
                    thursday: ["09:00", "18:00"],
                    friday: ["09:00", "18:00"],
                    saturday: ["12:00", "19:00"],
                    sunday: [],
                },
            })

            drivingSchoolFixture.thenTheCreatedDrivingSchoolShouldBe(
                keepFirstItem(
                    keepOnlyOkValues([
                        new DrivingSchoolBuilder()
                            .withId("20")
                            .withFingerprint("23d902-dasf90-234dse-23efd2")
                            .isAttachedToCompany(superDriveCompanyId)
                            .withEmail("super@drive.com")
                            .withPhone("+33.612345678")
                            .withName("SuperDrive Lille")
                            .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                            .withUpdatedAt(new Date("2024-07-19T01:35:00.000Z"))
                            .withAddress({
                                street: "4922 Rue de la Paix",
                                city: "Paris",
                                zipCode: "75001",
                                country: "France",
                            })
                            .withOpeningHours({
                                monday: ["09:00", "18:00"],
                                tuesday: ["09:00", "18:00"],
                                wednesday: ["09:00", "18:00"],
                                thursday: ["09:00", "18:00"],
                                friday: ["09:00", "18:00"],
                                saturday: ["12:00", "19:00"],
                                sunday: [],
                            })
                            .build(),
                    ])
                )
            )
        })
    })
})

function createSuperDriveCompany(companyId: CompanyId) {
    return new CompanyBuilder()
        .withId(companyId)
        .withFingerprint("23d902-dasf90-234dse-23efd2")
        .withName("SuperDrive")
        .withAddress({
            street: "123 Crenauto Street",
            city: "Paris",
            zipCode: "75001",
            country: "France",
        })
        .withPhone("+33.612345678")
        .withEmail("super@admin.com")
        .build()
}
