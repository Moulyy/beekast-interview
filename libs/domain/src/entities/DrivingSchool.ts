import { err, ok, type Result } from "@crenauto/error"

import { type Branded } from "../utils"
import type { CompanyId } from "./Company"
import {
    Email,
    ErrorInvalidEmail,
    ErrorInvalidPhoneNumber,
    Phone,
    type Address,
} from "./value-objects"
import type { HoursAndMinutes } from "./value-objects/Hours"

export type DrivingSchoolName = string
export type DrivingSchoolId = Branded<string, "DrivingSchoolId">
export type DrivingSchoolFingerprint = Branded<
    string,
    "DrivingSchoolFingerprint"
>

export type Days =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
export type DrivingSchoolOpeningHours = Record<Days, HoursAndMinutes[]>

export class DrivingSchool {
    static fromData(
        drivingSchoolData: DrivingSchool["data"]
    ): Result<DrivingSchool, ErrorInvalidEmail | ErrorInvalidPhoneNumber> {
        try {
            const newDrivingSchool = new DrivingSchool(
                drivingSchoolData.id,
                drivingSchoolData.fingerPrint,
                drivingSchoolData.companyId,
                drivingSchoolData.name,
                drivingSchoolData.address,
                Phone.of(drivingSchoolData.phone),
                Email.of(drivingSchoolData.email),
                drivingSchoolData.openingHours,
                drivingSchoolData.createdAt,
                drivingSchoolData.updatedAt
            )
            return ok(newDrivingSchool)
        } catch (error) {
            if (
                error instanceof ErrorInvalidEmail ||
                error instanceof ErrorInvalidPhoneNumber
            ) {
                return err(error)
            }
            throw error
        }
    }

    constructor(
        private _id: DrivingSchoolId,
        private _fingerPrint: DrivingSchoolFingerprint,
        private _companyId: CompanyId,
        private _name: DrivingSchoolName,
        private _address: Address,
        private _phone: Phone,
        private _email: Email,
        private _openingHours: DrivingSchoolOpeningHours,
        private _createdAt: Date,
        private _updatedAt: Date
    ) {}

    get companyId() {
        return this._companyId
    }

    get id() {
        return this._id
    }

    get data() {
        return {
            id: this._id,
            fingerPrint: this._fingerPrint,
            companyId: this._companyId,
            name: this._name,
            address: this._address,
            phone: this._phone.value,
            email: this._email.value,
            openingHours: this._openingHours,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        }
    }
}
