import type { CompanyId } from "../entities/Company"

export interface ForDeletingACompany {
    delete(id: CompanyId): Promise<void>
}
