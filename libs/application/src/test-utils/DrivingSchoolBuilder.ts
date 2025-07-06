import {
    DrivingSchool,
    type Address,
    type CompanyId,
    type DrivingSchoolFingerprint,
    type DrivingSchoolId,
    type DrivingSchoolOpeningHours,
} from "@crenauto/domain"

export class DrivingSchoolBuilder {
    private _id: string = ""
    private _fingerprint: string = ""
    private _companyId: string = ""
    private _name: string = ""
    private _address: Address = {
        street: "",
        city: "",
        zipCode: "",
        country: "",
    }
    private _phone: string = ""
    private _email: string = ""
    private _openingHours: DrivingSchoolOpeningHours = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    }
    private _createdAt!: Date
    private _updatedAt!: Date

    withId(id: string) {
        this._id = id
        return this
    }

    isAttachedToCompany(companyId: string) {
        this._companyId = companyId
        return this
    }

    withFingerprint(fingerprint: string) {
        this._fingerprint = fingerprint
        return this
    }

    withName(name: string) {
        this._name = name
        return this
    }

    withAddress(address: Address) {
        this._address = {
            street: address.street,
            city: address.city,
            zipCode: address.zipCode,
            country: address.country,
        }
        return this
    }

    withPhone(phone: string) {
        this._phone = phone
        return this
    }

    withEmail(email: string) {
        this._email = email
        return this
    }

    withOpeningHours(openingHours: DrivingSchoolOpeningHours) {
        this._openingHours = openingHours
        return this
    }

    withCreatedAt(createdAt: Date) {
        this._createdAt = createdAt
        return this
    }

    withUpdatedAt(updatedAt: Date) {
        this._updatedAt = updatedAt
        return this
    }

    build() {
        return DrivingSchool.fromData({
            id: this._id as DrivingSchoolId,
            fingerPrint: this._fingerprint as DrivingSchoolFingerprint,
            companyId: this._companyId as CompanyId,
            name: this._name,
            address: this._address,
            phone: this._phone,
            email: this._email,
            openingHours: this._openingHours,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        })
    }
}
