import type { Company, CompanyId } from "../entities/Company"

export interface ForEditingACompany {
    edit(id: CompanyId, company: Company): Promise<Company>
}
