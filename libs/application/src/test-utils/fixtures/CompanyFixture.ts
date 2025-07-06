import { expect } from "vitest"

import {
    Company,
    DrivingSchool,
    ErrorInvalidCompanyContact,
    ErrorInvalidCompanyName,
    ErrorInvalidEmail,
    ErrorInvalidPhoneNumber,
    ErrorNotFound,
    type CompanyId,
} from "@crenauto/domain"

import { InMemoryCompanyRepository } from "../../in-memory-repositories/InMemoryCompanyRepository"
import type { InMemoryDrivingSchoolRepository } from "../../in-memory-repositories/InMemoryDrivingSchoolRepository"
import {
    CreateACompanyUseCase,
    type CompanyToCreateCommand,
} from "../../usecases/CreateACompany"
import {
    DeleteACompanyUseCase,
    ErrorNotAuthorizedToDeleteACompany,
    SuccesfullyDeletedACompany,
} from "../../usecases/DeleteACompany"
import {
    EditACompanyUseCase,
    ErrorNotAuthorizedToEditACompany,
    type CompanyToEditCommand,
} from "../../usecases/EditACompany"
import {
    ErrorNotAuthorizedToRetrieveACompany,
    RetrieveACompanyUseCase,
} from "../../usecases/RetrieveACompany"
import {
    ErrorNotAuthorizedToRetrieveCompanies,
    RetrieveCompaniesUseCase,
} from "../../usecases/RetrieveCompanies"
import { ErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompany, RetrieveDrivingSchoolsOfACompanyUseCase } from "../../usecases/RetrieveDrivingSchoolsOfACompany"
import { StubDateProvider } from "../StubDateProvider"
import { StubIdProvider } from "../StubIdProvider"
import type { UserFixture } from "./UserFixture"
import { assertItIsSomething } from "./utils/assertItIsSomething"
import type { CrenautoStorage } from "./Storage"

export function createCompanyFixture({
    userFixture,
    storage,
}: {
    userFixture: UserFixture
    storage: CrenautoStorage
}) {
    let companies: Company[] | undefined
    let newCompany: Company | undefined
    let retrievedCompany: Company | undefined
    let editedCompany: Company | undefined
    let capturedError:
        | ErrorInvalidCompanyName
        | ErrorInvalidCompanyContact
        | undefined

    let drivingSchools: DrivingSchool[] | undefined
        
    let capturedResult: SuccesfullyDeletedACompany | undefined

    const companyRepository = new InMemoryCompanyRepository(
        storage
    )
    const stubIdProvider = new StubIdProvider()
    const stubDateProvider = new StubDateProvider()
    const createACompanyUseCase = new CreateACompanyUseCase(
        companyRepository,
        stubIdProvider,
        stubDateProvider
    )
    const retrieveCompaniesUseCase = new RetrieveCompaniesUseCase(
        companyRepository
    )

    const editACompaniesUseCase = new EditACompanyUseCase(
        companyRepository,
        stubDateProvider
    )

    const retrieveACompanyUseCase = new RetrieveACompanyUseCase(
        companyRepository
    )

    const deleteACompanyUseCase = new DeleteACompanyUseCase(companyRepository)

    const retrieveDrivingSchoolsOfACompanyUseCase =
        new RetrieveDrivingSchoolsOfACompanyUseCase(companyRepository)

    function givenTheNewCompnayHasTheId(id: string) {
        stubIdProvider.id = id
    }

    function givenTheNewCompanyHasTheFingerPrint(fingerPrint: string) {
        stubIdProvider.fingerPrint = fingerPrint
    }

    function givenNowIs(date: Date) {
        stubDateProvider.time = date
    }

    function givenTheCompaniesAre(givenCompanies: Company[]) {
        companyRepository.defineCompanies(givenCompanies)
    }

    async function whenTheLoggedInAccountCreateACompany(
        companyToCreate: CompanyToCreateCommand
    ) {
        assertItIsSomething(userFixture.currentUser)
        const newCreatedCompany = await createACompanyUseCase.execute(
            companyToCreate,
            userFixture.currentUser
        )

        if (newCreatedCompany.isErr()) {
            capturedError = newCreatedCompany.error
        } else {
            newCompany = newCreatedCompany.value
        }
    }

    async function whenTheLoggedInAccountRetrievesAllCompanies() {
        assertItIsSomething(userFixture.currentUser)

        const result = await retrieveCompaniesUseCase.execute(
            userFixture.currentUser
        )
        if (result.isErr()) {
            capturedError = result.error
        } else {
            companies = result.value
        }
    }

    async function whenTheLoggedInAccountEditsACompanyWith(
        companyId: CompanyId,
        companyToEdit: CompanyToEditCommand
    ) {
        assertItIsSomething(userFixture.currentUser)

        const result = await editACompaniesUseCase.execute(
            companyId,
            companyToEdit,
            userFixture.currentUser
        )
        if (result.isErr()) {
            capturedError = result.error
        } else {
            editedCompany = result.value
        }
    }

    async function whenTheLoggedInAccountGetACompanyById(companyId: CompanyId) {
        assertItIsSomething(userFixture.currentUser)

        const result = await retrieveACompanyUseCase.execute(
            userFixture.currentUser,
            companyId
        )
        if (result.isErr()) {
            capturedError = result.error
        } else {
            retrievedCompany = result.value
        }
    }

    async function whenTheLoggedInAccountDeletesACompany(companyId: CompanyId) {
        assertItIsSomething(userFixture.currentUser)

        const result = await deleteACompanyUseCase.execute(
            userFixture.currentUser,
            companyId
        )

        if (result.isErr()) {
            capturedError = result.error
        } else {
            capturedResult = result.value
        }
    }

    async function whenTheLoggedInAccountRetrievesDrivingSchoolsOfACompany(
        companyId: CompanyId
    ) {
        assertItIsSomething(userFixture.currentUser)

        const result = await retrieveDrivingSchoolsOfACompanyUseCase.execute(
            userFixture.currentUser,
            companyId
        )
        
        if (result.isErr()) {
            capturedError = result.error
        } else {
            drivingSchools = result.value
        }
    }

    function thenTheRetrievedCompanyShouldBe(company: Company) {
        assertItIsSomething(retrievedCompany)

        expect(retrievedCompany.data).toEqual(company.data)
    }

    function thenTheEditedCompanyShouldBe(company: Company) {
        assertItIsSomething(editedCompany)

        expect(editedCompany.data).toEqual(company.data)
    }

    function thenTheCompanyShouldBe(company: Company) {
        assertItIsSomething(newCompany)

        expect(newCompany.data).toEqual(company.data)
    }

    function thenTheCompaniesShouldBe(expectedCompanies: Company[]) {
        assertItIsSomething(companies)

        expect(companies).toEqual(expectedCompanies)
    }

    async function thenTheStoredCompaniesShouldBe(
        expectedCompanies: Company[]
    ) {
        const companies = await companyRepository.getAll()
        assertItIsSomething(companies)

        expect(companies).toEqual(expectedCompanies)
    }

    function thenTheCompanyShouldNotBeCreated() {
        expect(newCompany).toBeUndefined()
    }

    function thenTheCompanyShouldBeSuccessFullyDeleted() {
        expect(capturedResult).toBeDefined()
        expect(capturedResult).toBeInstanceOf(SuccesfullyDeletedACompany)
    }

    function thenTheRetrievedDrivingSchoolsShouldBe(expectedDrivingSchools: DrivingSchool[]) {
        assertItIsSomething(drivingSchools)
        
        drivingSchools
        expect(drivingSchools).toEqual(expectedDrivingSchools)
    }

    function thenAnErrorForInvalidCompanyNameShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorInvalidCompanyName)
    }

    function thenAnErrorForInvalidCompanyPhoneNumberShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorInvalidPhoneNumber)
    }

    function thenAnErrorForInvalidCompanyEmailShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorInvalidEmail)
    }

    function thenAnErrorNotAuthorizedToRetrieveCompaniesShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(
            ErrorNotAuthorizedToRetrieveCompanies
        )
    }

    function thenAnErrorNotAuthorizedToEditACompanyShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorNotAuthorizedToEditACompany)
    }

    function thenAnErrorNotAuthorizedToRetrieveACompanyShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(
            ErrorNotAuthorizedToRetrieveACompany
        )
    }

    function thenAnErrorNotAuthorizedToDeleteACompanyShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorNotAuthorizedToDeleteACompany)
    }

    function thenAnErrorNotNotFoundShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorNotFound)
    }

    function thenAnErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompanyShouldBeCaptured() {
        expect(capturedError).toBeDefined()
        expect(capturedError).toBeInstanceOf(ErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompany)
    }

    return {
        companyRepository,
        givenNowIs,
        givenTheNewCompnayHasTheId,
        givenTheNewCompanyHasTheFingerPrint,
        givenTheCompaniesAre,
        whenTheLoggedInAccountCreateACompany,
        whenTheLoggedInAccountRetrievesAllCompanies,
        whenTheLoggedInAccountEditsACompanyWith,
        whenTheLoggedInAccountGetACompanyById,
        whenTheLoggedInAccountDeletesACompany,
        whenTheLoggedInAccountRetrievesDrivingSchoolsOfACompany,
        thenTheCompanyShouldBe,
        thenTheRetrievedCompanyShouldBe,
        thenTheCompaniesShouldBe,
        thenTheStoredCompaniesShouldBe,
        thenTheCompanyShouldNotBeCreated,
        thenTheEditedCompanyShouldBe,
        thenTheCompanyShouldBeSuccessFullyDeleted,
        thenTheRetrievedDrivingSchoolsShouldBe,
        thenAnErrorForInvalidCompanyNameShouldBeCaptured,
        thenAnErrorForInvalidCompanyPhoneNumberShouldBeCaptured,
        thenAnErrorForInvalidCompanyEmailShouldBeCaptured,
        thenAnErrorNotAuthorizedToRetrieveCompaniesShouldBeCaptured,
        thenAnErrorNotAuthorizedToEditACompanyShouldBeCaptured,
        thenAnErrorNotAuthorizedToRetrieveACompanyShouldBeCaptured,
        thenAnErrorNotAuthorizedToDeleteACompanyShouldBeCaptured,
        thenAnErrorNotAuthorizedToRetrieveDrivingSchoolsOfACompanyShouldBeCaptured,
        thenAnErrorNotNotFoundShouldBeCaptured,
    }
}
export type CompanyFixture = ReturnType<typeof createCompanyFixture>
