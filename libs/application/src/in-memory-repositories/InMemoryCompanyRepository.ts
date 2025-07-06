import {
    type Company,
    type CompanyId,
    type IManageCompanies,
    DrivingSchool,
} from "@crenauto/domain"

import type { CrenautoStorage } from "../test-utils/fixtures/Storage"

export class InMemoryCompanyRepository implements IManageCompanies {
    constructor(private storage: CrenautoStorage) {}

    get companies() {
        return this.storage.data.companies
    }

    public async create(company: Company): Promise<Company> {
        this.storage.data.companies.push(company)
        return company
    }

    public async getAll(): Promise<Company[]> {
        return this.storage.data.companies
    }

    public async edit(id: CompanyId, company: Company): Promise<Company> {
        const companyToEditPosition = this.storage.data.companies.findIndex(
            (company) => company.id === id
        )

        this.storage.data.companies[companyToEditPosition] = company

        return this.storage.data.companies[companyToEditPosition]
    }

    public defineCompanies(companies: Company[]) {
        this.storage.data.companies = companies
    }

    public async getById(id: CompanyId): Promise<Company | undefined> {
        return this.storage.data.companies.find((company) => company.id === id)
    }

    public async delete(id: CompanyId): Promise<void> {
        this.storage.data.companies = this.storage.data.companies.filter(
            (company) => company.id !== id
        )
    }

    public async getDrivingSchoolsOfACompany(
        companyId: CompanyId
    ): Promise<DrivingSchool[]> {
        return this.storage.data.drivingSchools.filter(
            (drivingSchool) => drivingSchool.companyId === companyId
        )
    }
}
