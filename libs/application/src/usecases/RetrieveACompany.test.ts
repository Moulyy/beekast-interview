import { beforeEach, describe, test } from "vitest"
import {
    createCompanyFixture,
    type CompanyFixture,
} from "../test-utils/fixtures/CompanyFixture"
import { Admin, Student, type CompanyId } from "@crenauto/domain"
import { CompanyBuilder } from "../test-utils/CompanyBuilder"
import { keepFirstItem, keepOnlyOkValues } from "@crenauto/error"
import {
    type UserFixture,
    createUserFixture,
} from "../test-utils/fixtures/UserFixture"
import { CrenautoStorage } from "../test-utils/fixtures/Storage"

describe("Feature: Get a company", () => {
    let userFixture: UserFixture
    let companyFixture: CompanyFixture

    beforeEach(() => {
        const storage = new CrenautoStorage()
        userFixture = createUserFixture()
        companyFixture = createCompanyFixture({ userFixture, storage })
    })

    describe("Rule: The admin can retrieve a company by its id", () => {
        test("The logged in account is a super admin and should be able to retrieve a company", async () => {
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

            const expectedCompany = baseOfCompany
                .withId("1")
                .withName("Ankama")
                .withCreatedAt(new Date("2024-07-19T01:30:00.000Z"))
                .build()

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([
                    expectedCompany,
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
            const companyIdRequested = "1" as CompanyId
            await companyFixture.whenTheLoggedInAccountGetACompanyById(
                companyIdRequested
            )
            companyFixture.thenTheRetrievedCompanyShouldBe(
                keepFirstItem(keepOnlyOkValues([expectedCompany]))
            )
        })

        test("The logged in account is NOT a super admin and cannot retrieve any company", async () => {
            const nonSuperAdmin = Student.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            const companyIdRequested = "1" as CompanyId
            userFixture.givenTheLoggedInAccountIs(nonSuperAdmin)
            await companyFixture.whenTheLoggedInAccountGetACompanyById(
                companyIdRequested
            )
            companyFixture.thenAnErrorNotAuthorizedToRetrieveACompanyShouldBeCaptured()
        })
    })
})
