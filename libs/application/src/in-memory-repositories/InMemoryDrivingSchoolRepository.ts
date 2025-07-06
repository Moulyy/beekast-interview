import {
    ErrorCompanyNotFound,
    type DrivingSchool,
    type DrivingSchoolId,
    type ForCreatingADrivingSchool,
    type ForRetrievingADrivingSchool,
} from "@crenauto/domain"
import { err, ok, type Result } from "@crenauto/error"
import type { CrenautoStorage } from "../test-utils/fixtures/Storage"

export class InMemoryDrivingSchoolRepository
    implements ForCreatingADrivingSchool, ForRetrievingADrivingSchool
{
    constructor(private storage: CrenautoStorage) {}

    get drivingSchools() {
        return this.storage.data.drivingSchools
    }

    async create(
        drivingSchool: DrivingSchool
    ): Promise<Result<DrivingSchool, ErrorCompanyNotFound>> {
        const doesCompanyExist = await this.doesCompanyExist(
            drivingSchool.companyId
        )
        if (!doesCompanyExist) {
            return err(new ErrorCompanyNotFound())
        }

        this.storage.data.drivingSchools.push(drivingSchool)
        return ok(drivingSchool)
    }

    public async getById(
        id: DrivingSchoolId
    ): Promise<DrivingSchool | undefined> {
        return this.storage.data.drivingSchools.find(
            (drivingSchool) => drivingSchool.id === id
        )
    }

    public defineDrivingSchools(drivingSchools: DrivingSchool[]) {
        this.storage.data.drivingSchools = drivingSchools
    }

    private async doesCompanyExist(companyId: string) {
        const searchCompany = await this.storage.data.companies.find(
            (company) => company.id === companyId
        )

        return !!searchCompany
    }
}
