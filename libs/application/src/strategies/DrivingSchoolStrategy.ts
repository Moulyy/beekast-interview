import {
    DrivingSchool,
    type DrivingSchoolOpeningHours,
    UserRoles,
    type UserRole,
    type Address,
} from "@crenauto/domain"

interface ForTransformingDrivingSchool<T = DrivingSchool["data"]> {
    transform(drivingSchool: DrivingSchool): T
}

export class DrivingSchoolTransformerStrategy {
    createTransformer(userRole: UserRole) {
        if (userRole === UserRoles.ADMIN) {
            return new DrivingSchoolTransformerForAdmin()
        }
        return new DrivingSchoolTransformerForStudent()
    }
}

export class DrivingSchoolTransformerForStudent
    implements ForTransformingDrivingSchool<DrivingSchoolForStudent>
{
    public transform(drivingSchool: DrivingSchool): DrivingSchoolForStudent {
        return {
            id: drivingSchool.id,
            name: drivingSchool.data.name,
            phone: drivingSchool.data.phone,
            email: drivingSchool.data.email,
            address: drivingSchool.data.address,
            openingHours: drivingSchool.data.openingHours,
        }
    }
}

export class DrivingSchoolTransformerForAdmin
    implements ForTransformingDrivingSchool<DrivingSchool["data"]>
{
    public transform(drivingSchool: DrivingSchool): DrivingSchool["data"] {
        return drivingSchool.data
    }
}

export type DrivingSchoolForStudent = {
    id: string
    name: string
    phone: string
    email: string
    address: Address
    openingHours: DrivingSchoolOpeningHours
}

type ReturnTypeOfTransformer<T> =
    T extends ForTransformingDrivingSchool<infer R> ? R : never

export type DrivingSchoolTransformers = ReturnTypeOfTransformer<
    ReturnType<DrivingSchoolTransformerStrategy["createTransformer"]>
>
