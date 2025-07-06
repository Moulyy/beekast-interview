import { beforeEach, describe, test } from "vitest"

import { Admin, Director, Student, type CompanyId } from "@crenauto/domain"
import { keepOnlyOkValues } from "@crenauto/error"

import { CompanyBuilder } from "../test-utils/CompanyBuilder"
import { DrivingSchoolBuilder } from "../test-utils/DrivingSchoolBuilder"
import {
    createCompanyFixture,
    type CompanyFixture,
} from "../test-utils/fixtures/CompanyFixture"
import { createDateFixture } from "../test-utils/fixtures/DateFixture"
import {
    createDrivingSchoolFixture,
    type DrivingSchoolFixture,
} from "../test-utils/fixtures/DrivingSchoolFixture"
import { createIdFixture } from "../test-utils/fixtures/IdFixture"
import { CrenautoStorage } from "../test-utils/fixtures/Storage"
import {
    createUserFixture,
    type UserFixture,
} from "../test-utils/fixtures/UserFixture"

describe(`Feature: Retrieve driving schools of a company`, () => {
    let userFixture: UserFixture
    let companyFixture: CompanyFixture
    let drivingSchoolFixture: DrivingSchoolFixture

    beforeEach(() => {
        const storage = new CrenautoStorage()
        userFixture = createUserFixture()
        companyFixture = createCompanyFixture({ userFixture, storage })
        drivingSchoolFixture = createDrivingSchoolFixture({
            idFixture: createIdFixture(),
            dateFixture: createDateFixture(),
            storage,
        })
    })

    describe(`Scenario: The admin retrieves all the driving schools of a SuperDrive company`, () => {
        test(`Rule: An error is captured when the user is not an admin`, async () => {
            const student = Student.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            })

            const superDriveCompanyId = "1" as CompanyId

            userFixture.givenTheLoggedInAccountIs(student)
            await companyFixture.whenTheLoggedInAccountRetrievesDrivingSchoolsOfACompany(
                superDriveCompanyId
            )
            companyFixture.thenAnErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompanyShouldBeCaptured()
        })

        test(`Rule: The admin can retrieve all the driving schools of a company`, async () => {
            const admin = Admin.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
            })

            const superDriveCompanyId = "1" as CompanyId
            const driveYourCarCompanyId = "2" as CompanyId

            userFixture.givenTheLoggedInAccountIs(admin)
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([
                    new CompanyBuilder()
                        .withId(superDriveCompanyId)
                        .withName("SuperDrive")
                        .withPhone("+33.612345678")
                        .withEmail("super@drive.com")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                    new CompanyBuilder()
                        .withId(driveYourCarCompanyId)
                        .withName("DriveYourCar")
                        .withPhone("+33.612399678")
                        .withEmail("drive@your.car")
                        .withCreatedAt(new Date("2024-07-19T02:35:00.000Z"))
                        .build(),
                ])
            )
            drivingSchoolFixture.givenTheDrivingSchoolsAre(
                keepOnlyOkValues([
                    new DrivingSchoolBuilder()
                        .withId("1")
                        .isAttachedToCompany(superDriveCompanyId)
                        .withName("SuperDrive Lille")
                        .withPhone("+33.612345678")
                        .withEmail("super@drive.com")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                    new DrivingSchoolBuilder()
                        .withId("2")
                        .isAttachedToCompany(superDriveCompanyId)
                        .withName("SuperDrive Paris")
                        .withPhone("+33.612345678")
                        .withEmail("super@drive.com")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                    new DrivingSchoolBuilder()
                        .withId("3")
                        .isAttachedToCompany(driveYourCarCompanyId)
                        .withName("DriveYourCar Lille")
                        .withPhone("+33.612399678")
                        .withEmail("drive@your.car")
                        .withCreatedAt(new Date("2024-07-19T02:35:00.000Z"))
                        .build(),
                ])
            )

            await companyFixture.whenTheLoggedInAccountRetrievesDrivingSchoolsOfACompany(
                superDriveCompanyId
            )

            companyFixture.thenTheRetrievedDrivingSchoolsShouldBe(
                keepOnlyOkValues([
                    new DrivingSchoolBuilder()
                        .withId("1")
                        .isAttachedToCompany(superDriveCompanyId)
                        .withName("SuperDrive Lille")
                        .withPhone("+33.612345678")
                        .withEmail("super@drive.com")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.00Z"))
                        .build(),
                    new DrivingSchoolBuilder()
                        .withId("2")
                        .isAttachedToCompany(superDriveCompanyId)
                        .withName("SuperDrive Paris")
                        .withPhone("+33.612345678")
                        .withEmail("super@drive.com")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                ])
            )
        })
    })

    describe(`Scenario: The Director of SuperDrive Company retrieves driving schools of its Company`, async () => {
        test(`Rule: The Director can retrieve all the driving schools of its company`, async () => {
            const superDriveCompanyId = "1" as CompanyId
            const driveYourCarCompanyId = "2" as CompanyId

            const superDriveDirector = Director.make({
                id: "1",
                name: "John Doe",
                email: "john@doe.com",
                password: "123456",
                relatedCompany: superDriveCompanyId,
            })

            userFixture.givenTheLoggedInAccountIs(superDriveDirector)
            companyFixture.givenTheCompaniesAre(
                keepOnlyOkValues([
                    new CompanyBuilder()
                        .withId(superDriveCompanyId)
                        .withName("SuperDrive")
                        .withPhone("+33.612345678")
                        .withEmail("super@drive.com")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                    new CompanyBuilder()
                        .withId(driveYourCarCompanyId)
                        .withName("DriveYourCar")
                        .withPhone("+33.612399678")
                        .withEmail("drive@your.car")
                        .withCreatedAt(new Date("2024-07-19T02:35:00.000Z"))
                        .build(),
                ])
            )
            drivingSchoolFixture.givenTheDrivingSchoolsAre(
                keepOnlyOkValues([
                    new DrivingSchoolBuilder()
                        .withId("1")
                        .isAttachedToCompany(superDriveCompanyId)
                        .withName("SuperDrive Lille")
                        .withPhone("+33.612345678")
                        .withEmail("super@drive.com")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                    new DrivingSchoolBuilder()
                        .withId("2")
                        .isAttachedToCompany(driveYourCarCompanyId)
                        .withName("DriveYourCar Paris")
                        .withPhone("+33.612399678")
                        .withEmail("drive@your.car")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                    new DrivingSchoolBuilder()
                        .withId("3")
                        .isAttachedToCompany(driveYourCarCompanyId)
                        .withName("DriveYourCar Marseille")
                        .withPhone("+33.612399678")
                        .withEmail("drive@your.car")
                        .withCreatedAt(new Date("2024-07-19T02:35:00.000Z"))
                        .build(),
                ])
            )

            await companyFixture.whenTheLoggedInAccountRetrievesDrivingSchoolsOfACompany(
                superDriveCompanyId
            )

            companyFixture.thenTheRetrievedDrivingSchoolsShouldBe(
                keepOnlyOkValues([
                    new DrivingSchoolBuilder()
                        .withId("1")
                        .isAttachedToCompany(superDriveCompanyId)
                        .withName("SuperDrive Lille")
                        .withPhone("+33.612345678")
                        .withEmail("super@drive.com")
                        .withCreatedAt(new Date("2024-07-19T01:35:00.000Z"))
                        .build(),
                ])
            )
        })
    })
})
