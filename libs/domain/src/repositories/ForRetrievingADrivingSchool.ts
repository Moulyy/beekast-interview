import type { DrivingSchool } from "../entities"

export interface ForRetrievingADrivingSchool {
    getById(id: string): Promise<DrivingSchool | undefined>
}
