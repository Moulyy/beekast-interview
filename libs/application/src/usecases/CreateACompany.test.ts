import { beforeEach, describe, test } from "vitest"

import { Admin, Student } from "@crenauto/domain"
import { assertItIsOk } from "@crenauto/error"

import { CompanyBuilder } from "../test-utils/CompanyBuilder"
import {
    type CompanyFixture,
    createCompanyFixture,
} from "../test-utils/fixtures/CompanyFixture"
import { type UserFixture, createUserFixture } from "../test-utils/fixtures/UserFixture"
import { CrenautoStorage } from "../test-utils/fixtures/Storage"

describe("Feature: Create a company", () => {
    let userFixture: UserFixture
    let companyFixture: CompanyFixture

    beforeEach(() => {
        const storage = new CrenautoStorage()
        userFixture = createUserFixture()
        companyFixture = createCompanyFixture({ userFixture, storage })
    })

    describe(`Rule: A company can only be created by a super admin`, () => {
        test("The logged in account is NOT a super admin and should NOT be able to create a company", async () => {
            const student = Student.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            userFixture.givenTheLoggedInAccountIs(student)
            await companyFixture.whenTheLoggedInAccountCreateACompany({
                name: "Crenauto",
                address: {
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                },
                legalStatus: "Private",
                contact: {
                    phone: "123456789",
                    email: "super@admin.com",
                },
            })
            companyFixture.thenTheCompanyShouldNotBeCreated()
        })

        test(`The logged in account should be able to register a new company because it's a super admin`, async () => {
            const admin = Admin.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            const expectedNewCompany = new CompanyBuilder()
                .withId("1")
                .withFingerprint("23d902-dasf90-234dse-23efd2")
                .withName("Crenauto")
                .withAddress({
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                })
                .withLegalStatus("SARL")
                .withPhone("+33.612345678")
                .withEmail("super@admin.com")
                .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                .withUpdatedAt(new Date("2024-07-19T01:35:00.000Z"))
                .build()

            assertItIsOk(expectedNewCompany)

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheNewCompnayHasTheId("1")
            companyFixture.givenTheNewCompanyHasTheFingerPrint(
                "23d902-dasf90-234dse-23efd2"
            )
            companyFixture.givenNowIs(new Date("2024-07-19T01:35:00.000Z"))
            await companyFixture.whenTheLoggedInAccountCreateACompany({
                name: "Crenauto",
                address: {
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                },
                legalStatus: "SARL",
                contact: {
                    phone: "+33.612345678",
                    email: "super@admin.com",
                },
            })
            companyFixture.thenTheCompanyShouldBe(expectedNewCompany.value)
        })
    })

    describe(`Rule: Every data must be valid and provided`, () => {
        test(`The logged in account cannot create a company without company name`, async () => {
            const admin = Admin.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheNewCompnayHasTheId("1")
            companyFixture.givenNowIs(new Date("2024-07-19T01:35:00.000Z"))
            await companyFixture.whenTheLoggedInAccountCreateACompany({
                name: "",
                address: {
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                },
                legalStatus: "SARL",
                contact: {
                    phone: "123456789",
                    email: "super@admin.com",
                },
            })
            companyFixture.thenTheCompanyShouldNotBeCreated()
            companyFixture.thenAnErrorForInvalidCompanyNameShouldBeCaptured()
        })

        test("The logged in account cannot create a company because the format of the phone number is wrong", async () => {
            const admin = Admin.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheNewCompnayHasTheId("1")
            companyFixture.givenNowIs(new Date("2024-07-19T01:35:00.000Z"))
            await companyFixture.whenTheLoggedInAccountCreateACompany({
                name: "Crenauto",
                address: {
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                },
                legalStatus: "SARL",
                contact: {
                    phone: "12345",
                    email: "super@admin.com",
                },
            })
            companyFixture.thenTheCompanyShouldNotBeCreated()
            companyFixture.thenAnErrorForInvalidCompanyPhoneNumberShouldBeCaptured()
        })

        test("The logged in account cannot create a company because the format of the email is wrong", async () => {
            const admin = Admin.make({
                id: "1",
                name: "Super Admin",
                email: "super@admin.com",
                password: "123456",
            })

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheNewCompnayHasTheId("1")
            companyFixture.givenNowIs(new Date("2024-07-19T01:35:00.000Z"))
            await companyFixture.whenTheLoggedInAccountCreateACompany({
                name: "Crenauto",
                address: {
                    street: "123 Crenauto Street",
                    city: "Paris",
                    zipCode: "75001",
                    country: "France",
                },
                legalStatus: "SARL",
                contact: {
                    phone: "+33.612345678",
                    email: "super@admin",
                },
            })
            companyFixture.thenTheCompanyShouldNotBeCreated()
            companyFixture.thenAnErrorForInvalidCompanyEmailShouldBeCaptured()
        })
    })
})
