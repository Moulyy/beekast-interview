import { beforeEach, describe, test } from "vitest"

import { Admin, Student, type CompanyId } from "@crenauto/domain"
import { keepFirstItem, keepOnlyOkValues } from "@crenauto/error"

import {
    createCompanyFixture,
    type CompanyFixture,
} from "../test-utils/fixtures/CompanyFixture"
import { CompanyBuilder } from "../test-utils/CompanyBuilder"
import {
    type UserFixture,
    createUserFixture,
} from "../test-utils/fixtures/UserFixture"
import { CrenautoStorage } from "../test-utils/fixtures/Storage"

describe(`Feature: Edit a company`, () => {
    let userFixture: UserFixture
    let companyFixture: CompanyFixture
    beforeEach(() => {
        const storage = new CrenautoStorage()
        userFixture = createUserFixture()
        companyFixture = createCompanyFixture({ userFixture, storage })
    })

    describe(`Rule: A company can only be edited by a super admin`, () => {
        test(`The logged in account is NOT a super admin and so cannot edit a company`, async () => {
            const student = Student.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            const companyId = "2" as CompanyId

            userFixture.givenTheLoggedInAccountIs(student)
            companyFixture.givenTheCompaniesAre([])
            await companyFixture.whenTheLoggedInAccountEditsACompanyWith(
                companyId,
                {}
            )
            companyFixture.thenAnErrorNotAuthorizedToEditACompanyShouldBeCaptured()
        })

        test(`The logged in account is a super admin and so can edit a company`, async () => {
            const admin = Admin.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            const idOfCompanyToEdit = "2" as CompanyId

            const crenautoCompanyBuilder = new CompanyBuilder()
                .withId(idOfCompanyToEdit)
                .withName("Crenauto")
                .withEmail("super@admin.com")
                .withPhone("+33.612345678")
                .withLegalStatus("SARL")
                .withAddress({
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                })

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([crenautoCompanyBuilder.build()])
            )
            await companyFixture.whenTheLoggedInAccountEditsACompanyWith(
                idOfCompanyToEdit,
                {
                    legalStatus: "SASU",
                    // new address
                    address: {
                        street: "4235 Somewhere else",
                        city: "Lille",
                        zipCode: "59000",
                        country: "France",
                    },
                    name: "Crenautoooo",
                }
            )
            companyFixture.thenTheEditedCompanyShouldBe(
                keepFirstItem(
                    keepOnlyOkValues([
                        crenautoCompanyBuilder
                            .withName("Crenautoooo")
                            .withAddress({
                                street: "4235 Somewhere else",
                                city: "Lille",
                                zipCode: "59000",
                                country: "France",
                            })
                            .withLegalStatus("SASU")
                            .build(),
                    ])
                )
            )
        })
    })

    describe(`Rule: If the id of the company to edit is not valid, an error must be captured`, () => {
        test(`The id of the company to edit is not valid`, async () => {
            const admin = Admin.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            const companyId = "2" as CompanyId

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheCompaniesAre([])
            await companyFixture.whenTheLoggedInAccountEditsACompanyWith(
                companyId,
                {}
            )
            companyFixture.thenAnErrorNotNotFoundShouldBeCaptured()
        })
    })

    describe(`Rule: The company updated date must changed when the company is edited`, () => {
        test(`The company updated date must changed when the company is edited`, async () => {
            const admin = Admin.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            const idOfCompanyToEdit = "2" as CompanyId

            const crenautoCompanyBuilder = new CompanyBuilder()
                .withId(idOfCompanyToEdit)
                .withName("Crenauto")
                .withEmail("super@admin.com")
                .withPhone("+33.612345678")
                .withLegalStatus("SARL")
                .withAddress({
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                })
                .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                .withUpdatedAt(new Date("2024-07-19T01:35:00.000Z"))

            companyFixture.givenNowIs(new Date("2024-07-19T02:35:00.000Z"))
            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([crenautoCompanyBuilder.build()])
            )
            await companyFixture.whenTheLoggedInAccountEditsACompanyWith(
                idOfCompanyToEdit,
                {
                    legalStatus: "SASU",
                }
            )
            companyFixture.thenTheEditedCompanyShouldBe(
                keepFirstItem(
                    keepOnlyOkValues([
                        crenautoCompanyBuilder
                            .withLegalStatus("SASU")
                            .withUpdatedAt(new Date("2024-07-19T02:35:00.000Z"))
                            .build(),
                    ])
                )
            )
        })
    })
})
