import type { Company } from "../entities/Company"

export interface ForRetrievingCompanies {
    getAll(): Promise<Company[]>
}
