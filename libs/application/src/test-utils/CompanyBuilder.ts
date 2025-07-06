import {
    Company,
    type Address,
    type CompanyFingerprint,
    type CompanyId,
} from "@crenauto/domain"

export class CompanyBuilder {
    private _id: string = ""
    private _fingerprint: string = ""
    private _name: string = ""
    private _address: Address = {
        street: "",
        city: "",
        zipCode: "",
        country: "",
    }
    private _legalStatus: string = ""
    private _contact: {
        phone: string
        email: string
    } = {
        phone: "",
        email: "",
    }
    private _createdAt!: Date
    private _updatedAt!: Date

    withId(id: string) {
        this._id = id
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

    withLegalStatus(legalStatus: string) {
        this._legalStatus = legalStatus
        return this
    }

    withPhone(phone: string) {
        this._contact.phone = phone
        return this
    }

    withEmail(email: string) {
        this._contact.email = email
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
        return Company.fromData({
            id: this._id as CompanyId,
            fingerprint: this._fingerprint as CompanyFingerprint,
            name: this._name,
            address: this._address,
            legalStatus: this._legalStatus,
            contact: {
                phone: this._contact.phone,
                email: this._contact.email,
            },
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        })
    }
}
