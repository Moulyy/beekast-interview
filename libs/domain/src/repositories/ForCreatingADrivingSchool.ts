import { ErrorCompanyNotFound } from "@crenauto/domain"
import type { Result } from "@crenauto/error"

import type { DrivingSchool } from "../entities"

export interface ForCreatingADrivingSchool {
    create(
        drivingSchool: DrivingSchool
    ): Promise<Result<DrivingSchool, ErrorCompanyNotFound>>
}
