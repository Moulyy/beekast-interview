import { Admin, Student, type CompanyId } from "@crenauto/domain"
import { keepOnlyOkValues } from "@crenauto/error"
import { describe, test, beforeEach } from "vitest"
import { CompanyBuilder } from "../test-utils/CompanyBuilder"
import {
    createCompanyFixture,
    type CompanyFixture,
} from "../test-utils/fixtures/CompanyFixture"
import {
    type UserFixture,
    createUserFixture,
} from "../test-utils/fixtures/UserFixture"
import { CrenautoStorage } from "../test-utils/fixtures/Storage"

describe("Feature: Delete a company", () => {
    let userFixture: UserFixture
    let companyFixture: CompanyFixture

    beforeEach(() => {
        const storage = new CrenautoStorage()
        userFixture = createUserFixture()
        companyFixture = createCompanyFixture({ userFixture, storage })
    })

    describe("Rule: A company can only be deleted by a super admin", () => {
        test("The logged in account is NOT a super admin and so cannot delete a company", async () => {
            const student = Student.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            })

            const companyId = "1" as CompanyId
            userFixture.givenTheLoggedInAccountIs(student)
            await companyFixture.whenTheLoggedInAccountDeletesACompany(
                companyId
            )
            companyFixture.thenAnErrorNotAuthorizedToDeleteACompanyShouldBeCaptured()
        })

        test("The logged in account is a super admin and so can delete a company", async () => {
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

            const companyIdToDelete = "1" as CompanyId

            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([
                    baseOfCompany
                        .withId("1")
                        .withName("SuperDrive")
                        .withCreatedAt(new Date("2024-07-19T01:34:00.000Z"))
                        .build(),
                    baseOfCompany
                        .withId("2")
                        .withName("DriveYourCar")
                        .withCreatedAt(new Date("2024-07-19T01:40:00.000Z"))
                        .build(),
                ])
            )
            userFixture.givenTheLoggedInAccountIs(admin)
            await companyFixture.whenTheLoggedInAccountDeletesACompany(
                companyIdToDelete
            )
            companyFixture.thenTheCompanyShouldBeSuccessFullyDeleted()
            companyFixture.thenTheStoredCompaniesShouldBe(
                keepOnlyOkValues([
                    baseOfCompany
                        .withId("2")
                        .withName("DriveYourCar")
                        .withCreatedAt(new Date("2024-07-19T01:40:00.000Z"))
                        .build(),
                ])
            )
        })
    })
})
