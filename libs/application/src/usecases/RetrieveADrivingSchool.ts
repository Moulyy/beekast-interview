import {
    ErrorNotFound,
    User,
    type DrivingSchool,
    type DrivingSchoolId,
    type ForRetrievingADrivingSchool,
} from "@crenauto/domain"
import { err, ok, type Result } from "@crenauto/error"
import {
    DrivingSchoolTransformerStrategy,
    type DrivingSchoolTransformers,
} from "../strategies/DrivingSchoolStrategy"

export class RetrieveADrivingSchoolUseCase {
    constructor(
        private drivingSchoolRepository: ForRetrievingADrivingSchool,
        private drivingSchoolStrategy: DrivingSchoolTransformerStrategy
    ) {}

    async execute(
        drivingSchoolId: DrivingSchoolId,
        user: User
    ): Promise<Result<DrivingSchoolTransformers, Error>> {
        const drivingSchool =
            await this.drivingSchoolRepository.getById(drivingSchoolId)

        // TODO: Check if the user has the rights to retrieve the requested driving school

        if (drivingSchool === undefined) {
            return err(new ErrorNotFound())
        }

        const transformer = this.drivingSchoolStrategy.createTransformer(
            user.role
        )
        return ok(transformer.transform(drivingSchool))
    }
}
