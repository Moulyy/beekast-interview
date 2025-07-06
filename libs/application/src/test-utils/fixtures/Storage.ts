import { Company, DrivingSchool } from "@crenauto/domain"

export type InMemoryStorage = {
    companies: Company[]
    drivingSchools: DrivingSchool[]
}

export class CrenautoStorage {
    public data: InMemoryStorage = {
        companies: [],
        drivingSchools: [],
    }

    $reset(): void {
        this.data = {
            companies: [],
            drivingSchools: [],
        }
    }
}
