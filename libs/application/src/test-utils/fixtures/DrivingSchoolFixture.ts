import {
    ErrorCompanyNotFound,
    ErrorNotFound,
    User,
    type DrivingSchool,
    type DrivingSchoolId,
} from "@crenauto/domain"
import { expect } from "vitest"
import { InMemoryDrivingSchoolRepository } from "../../in-memory-repositories/InMemoryDrivingSchoolRepository"
import {
    DrivingSchoolTransformerStrategy,
    type DrivingSchoolTransformers,
} from "../../strategies/DrivingSchoolStrategy"
import {
    CreateADrivingSchoolUseCase,
    ErrorNotAuthorizedToCreateADrivingSchool,
    type DrivingSchoolToCreateCommand,
} from "../../usecases/CreateADrivingSchool"
import { RetrieveADrivingSchoolUseCase } from "../../usecases/RetrieveADrivingSchool"
import type { createDateFixture } from "./DateFixture"
import type { createIdFixture } from "./IdFixture"
import type { CrenautoStorage } from "./Storage"
import type { createUserFixture } from "./UserFixture"
import { assertItIsSomething } from "./utils/assertItIsSomething"

export function createDrivingSchoolFixture({
    userFixture,
    idFixture,
    dateFixture,
    storage,
}: {
    userFixture: ReturnType<typeof createUserFixture>
    idFixture: ReturnType<typeof createIdFixture>
    dateFixture: ReturnType<typeof createDateFixture>
    storage: CrenautoStorage
}) {
    let capturedError: Error | undefined
    let createdDrivingSchool: DrivingSchool | undefined
    let retrievedDrivingSchool: DrivingSchoolTransformers | undefined

    let drivingSchoolRepository = new InMemoryDrivingSchoolRepository(storage)

    const createADrivingSchoolUseCase = new CreateADrivingSchoolUseCase(
        drivingSchoolRepository,
        idFixture.idProvider,
        dateFixture.dateProvider
    )

    const drivingSchoolStrategy = new DrivingSchoolTransformerStrategy()

    const retrieveADrivingSchoolUseCase = new RetrieveADrivingSchoolUseCase(
        drivingSchoolRepository,
        drivingSchoolStrategy
    )

    async function givenTheDrivingSchoolsAre(
        givenDrivingSchools: DrivingSchool[]
    ) {
        drivingSchoolRepository.defineDrivingSchools(givenDrivingSchools)
    }

    async function whenAUserCreateADrivingSchool(
        user: User,
        drivingSchoolCommand: DrivingSchoolToCreateCommand
    ) {
        const result = await createADrivingSchoolUseCase.execute(
            user,
            drivingSchoolCommand
        )

        if (result.isErr()) {
            capturedError = result.error
        } else {
            createdDrivingSchool = result.value
        }
    }

    async function whenTheUserRetrievesADrivingSchool(
        drivingSchoolId: DrivingSchoolId
    ) {
        assertItIsSomething(userFixture.currentUser)
        const result = await retrieveADrivingSchoolUseCase.execute(
            drivingSchoolId,
            userFixture.currentUser
        )

        if (result.isErr()) {
            capturedError = result.error
        } else {
            retrievedDrivingSchool = result.value
        }
    }

    function thenAnErrorForUnauthorizedToCreateADrivingSchoolShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(
            ErrorNotAuthorizedToCreateADrivingSchool
        )
    }

    function thenAnErrorCompanyNotFoundShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorCompanyNotFound)
    }

    function thenTheCreatedDrivingSchoolShouldBe(drivingSchool: DrivingSchool) {
        assertItIsSomething(createdDrivingSchool)

        expect(createdDrivingSchool.data).toEqual(drivingSchool.data)
    }

    function thenTheRetrievedDrivingSchoolShouldBe(
        drivingSchool: DrivingSchoolTransformers
    ) {
        assertItIsSomething(retrievedDrivingSchool)
        expect(drivingSchool).toEqual(retrievedDrivingSchool)
    }

    function thenAnErrorDrivingSchoolNotFoundShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorNotFound)
    }

    return {
        givenTheDrivingSchoolsAre,
        whenAUserCreateADrivingSchool,
        whenTheUserRetrievesADrivingSchool,
        thenTheCreatedDrivingSchoolShouldBe,
        thenTheRetrievedDrivingSchoolShouldBe,
        thenAnErrorForUnauthorizedToCreateADrivingSchoolShouldBeCaptured,
        thenAnErrorCompanyNotFoundShouldBeCaptured,
        thenAnErrorDrivingSchoolNotFoundShouldBeCaptured,
    }
}

export type DrivingSchoolFixture = ReturnType<typeof createDrivingSchoolFixture>
