import { beforeEach, describe, test } from "vitest"

import { Admin, Student } from "@crenauto/domain"
import { keepOnlyOkValues } from "@crenauto/error"

import { CompanyBuilder } from "../test-utils/CompanyBuilder"
import {
    createCompanyFixture,
    type CompanyFixture,
} from "../test-utils/fixtures/CompanyFixture"
import { createUserFixture, type UserFixture } from "../test-utils/fixtures/UserFixture"
import { CrenautoStorage } from "../test-utils/fixtures/Storage"

describe("Feature: Retrieve companies", () => {
    let userFixture: UserFixture
    let companyFixture: CompanyFixture

    beforeEach(() => {
        const storage = new CrenautoStorage()
        userFixture = createUserFixture()
        companyFixture = createCompanyFixture({ userFixture, storage })
    })

    describe("Rule: The retrieved companies must be sorted by creation date in descending order", () => {
        test("The logged in account is a super admin and should be able to retrieve all companies", async () => {
            const admin = Admin.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            const baseOfCompany = new CompanyBuilder()
                .withEmail("super@admin.com")
                .withPhone("+33.612345678")
                .withLegalStatus("SARL")

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([
                    baseOfCompany
                        .withId("1")
                        .withName("Ankama")
                        .withCreatedAt(new Date("2024-07-19T01:30:00.000Z"))
                        .build(),
                    baseOfCompany
                        .withId("2")
                        .withName("SuperDrive")
                        .withCreatedAt(new Date("2024-07-19T01:34:00.000Z"))
                        .build(),
                    baseOfCompany
                        .withId("3")
                        .withName("DriveYourCar")
                        .withCreatedAt(new Date("2024-07-19T01:40:00.000Z"))
                        .build(),
                ])
            )
            await companyFixture.whenTheLoggedInAccountRetrievesAllCompanies()
            companyFixture.thenTheCompaniesShouldBe(
                keepOnlyOkValues([
                    baseOfCompany
                        .withId("3")
                        .withName("DriveYourCar")
                        .withCreatedAt(new Date("2024-07-19T01:40:00.000Z"))
                        .build(),
                    baseOfCompany
                        .withId("2")
                        .withName("SuperDrive")
                        .withCreatedAt(new Date("2024-07-19T01:34:00.000Z"))
                        .build(),
                    baseOfCompany
                        .withId("1")
                        .withName("Ankama")
                        .withCreatedAt(new Date("2024-07-19T01:30:00.000Z"))
                        .build(),
                ])
            )
        })

        test("The logged in account is NOT a super admin and cannot retrieve any companies", async () => {
            const student = Student.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            userFixture.givenTheLoggedInAccountIs(student)
            await companyFixture.whenTheLoggedInAccountRetrievesAllCompanies()
            companyFixture.thenAnErrorNotAuthorizedToRetrieveCompaniesShouldBeCaptured()
        })
    })
})
