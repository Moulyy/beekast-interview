import type { Company } from "../entities/Company"

export interface ForCreatingACompany {
    create(company: Company): Promise<Company>
}
