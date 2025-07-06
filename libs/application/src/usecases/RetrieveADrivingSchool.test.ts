import { beforeEach, describe, test } from "vitest"
import {
    createUserFixture,
    type UserFixture,
} from "../test-utils/fixtures/UserFixture"
import {
    Admin,
    Student,
    type CompanyId,
    type DrivingSchoolFingerprint,
    type DrivingSchoolId,
} from "@crenauto/domain"
import {
    createDrivingSchoolFixture,
    type DrivingSchoolFixture,
} from "../test-utils/fixtures/DrivingSchoolFixture"
import {
    createIdFixture,
    type IdFixture,
} from "../test-utils/fixtures/IdFixture"
import {
    createDateFixture,
    type DateFixture,
} from "../test-utils/fixtures/DateFixture"
import {
    createCompanyFixture,
    type CompanyFixture,
} from "../test-utils/fixtures/CompanyFixture"
import { DrivingSchoolBuilder } from "../test-utils/DrivingSchoolBuilder"
import { keepFirstItem, keepOnlyOkValues } from "@crenauto/error"
import { CrenautoStorage } from "../test-utils/fixtures/Storage"

describe("Feature: Retrieve a driving school", () => {
    let userFixture: UserFixture
    let drivingSchoolFixture: DrivingSchoolFixture
    let companyFixture: CompanyFixture
    let idFixture: IdFixture
    let dateFixture: DateFixture

    beforeEach(() => {
        const storage = new CrenautoStorage()
        userFixture = createUserFixture()
        idFixture = createIdFixture()
        dateFixture = createDateFixture()
        companyFixture = createCompanyFixture({ userFixture, storage })
        drivingSchoolFixture = createDrivingSchoolFixture({
            userFixture,
            idFixture,
            dateFixture,
            storage,
        })
    })
    describe("Scenario: the admin can retrieve a driving school", () => {
        test("Rule: The logged in account is a super admin and should be able to retrieve a driving school", async () => {
            const superAdmin = Admin.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            })

            const drivingSchoolId = "1" as DrivingSchoolId

            const expectedDrivingSchool = new DrivingSchoolBuilder()
                .withId(drivingSchoolId)
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
                .withOpeningHours({
                    monday: ["09:00", "18:00"],
                    tuesday: ["09:00", "18:00"],
                    wednesday: ["09:00", "18:00"],
                    thursday: ["09:00", "18:00"],
                    friday: ["09:00", "18:00"],
                    saturday: ["12:00", "19:00"],
                    sunday: [],
                })
                .isAttachedToCompany("1")
                .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                .withUpdatedAt(new Date("2024-07-19T01:35:00.000Z"))
                .build()
            userFixture.givenTheLoggedInAccountIs(superAdmin)
            drivingSchoolFixture.givenTheDrivingSchoolsAre(
                keepOnlyOkValues([
                    expectedDrivingSchool,
                    new DrivingSchoolBuilder()
                        .withId("2")
                        .withFingerprint("23d86787-dasf90-234dse-23efd2")
                        .withName("AutoSchool")
                        .withAddress({
                            street: "12 rue de la paix",
                            city: "Paris",
                            zipCode: "75001",
                            country: "France",
                        })
                        .withPhone("+33.612345678")
                        .withEmail("super@admin.com")
                        .withOpeningHours({
                            monday: ["09:00", "18:00"],
                            tuesday: ["09:00", "18:00"],
                            wednesday: ["09:00", "18:00"],
                            thursday: ["09:00", "18:00"],
                            friday: ["09:00", "18:00"],
                            saturday: ["12:00", "19:00"],
                            sunday: [],
                        })
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .withUpdatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                ])
            )
            await drivingSchoolFixture.whenTheUserRetrievesADrivingSchool(
                drivingSchoolId
            )
            drivingSchoolFixture.thenTheRetrievedDrivingSchoolShouldBe({
                id: drivingSchoolId,
                fingerPrint:
                    "23d902-dasf90-234dse-23efd2" as DrivingSchoolFingerprint,
                name: "SuperDrive",
                address: {
                    street: "123 Crenauto Street",
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
                companyId: "1" as CompanyId,
                createdAt: new Date("2024-07-19T01:35:00.000Z"),
                updatedAt: new Date("2024-07-19T01:35:00.000Z"),
                email: "super@admin.com",
                phone: "+33.612345678",
            })
        })

        test("Rule: The logged in account is a super admin and try to retrieve a driving school that does not exist", async () => {
            const superAdmin = Admin.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            })

            const drivingSchoolId = "3" as DrivingSchoolId

            userFixture.givenTheLoggedInAccountIs(superAdmin)
            drivingSchoolFixture.givenTheDrivingSchoolsAre([])
            await drivingSchoolFixture.whenTheUserRetrievesADrivingSchool(
                drivingSchoolId
            )
            drivingSchoolFixture.thenAnErrorDrivingSchoolNotFoundShouldBeCaptured()
        })
    })

    describe("Scenario: The student can retrieve a driving school", () => {
        test("Rule: The logged in account is a student and should be able to retrieve contact information and opening hours of a company", async () => {
            const student = Student.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            })

            userFixture.givenTheLoggedInAccountIs(student)
            drivingSchoolFixture.givenTheDrivingSchoolsAre(
                keepOnlyOkValues([
                    new DrivingSchoolBuilder()
                        .withId("1")
                        .withFingerprint("23d902-dasf90-234dse-23efd2")
                        .withName("SuperDrive")
                        .withEmail("super@drive.com")
                        .withPhone("+33.612345678")
                        .withAddress({
                            street: "123 Crenauto Street",
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
                        .isAttachedToCompany("1")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                ])
            )
            await drivingSchoolFixture.whenTheUserRetrievesADrivingSchool(
                "1" as DrivingSchoolId
            )
            drivingSchoolFixture.thenTheRetrievedDrivingSchoolShouldBe({
                id: "1" as DrivingSchoolId,
                name: "SuperDrive",
                address: {
                    street: "123 Crenauto Street",
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
                email: "super@drive.com",
                phone: "+33.612345678",
            })
        })
    })
})
