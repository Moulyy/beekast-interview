import type { Company, CompanyId } from "../entities/Company"

export interface ForRetrievingACompany {
    getById(id: CompanyId): Promise<Company | undefined>
}
