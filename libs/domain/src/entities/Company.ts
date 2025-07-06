import { err, ok, type Result } from "@crenauto/error"
import type { Branded } from "../utils"
import { Phone, ErrorInvalidPhoneNumber } from "./value-objects/Phone"
import { Email, ErrorInvalidEmail } from "./value-objects/Email"
import type { Address } from "./value-objects/Address"

export type CompanyId = Branded<string, "CompanyId">
export type CompanyFingerprint = Branded<string, "CompanyFingerprint">
export type CompanyStreet = string
export type CompanyCity = string
export type CompanyZipCode = string
export type CompanyLegalStatus = string
export type CompanyCountry = string

export type CompanyData = Company["data"]

export type CreateCompanyFromDataErrors =
    | ErrorInvalidCompanyName
    | ErrorInvalidCompanyContact
    | ErrorInvalidPhoneNumber
    | ErrorInvalidEmail

export class ErrorInvalidCompanyName extends Error {}
export class ErrorInvalidCompanyContact extends Error {}
export class ErrorCompanyNotFound extends Error {}

export class Company {
    static fromData(
        data: CompanyData
    ): Result<Company, CreateCompanyFromDataErrors> {
        try {
            const newCompany = new Company(
                data.id as CompanyId,
                data.fingerprint as CompanyFingerprint,
                CompanyName.of(data.name),
                data.address,
                data.legalStatus,
                Phone.of(data.contact.phone),
                Email.of(data.contact.email),
                data.createdAt,
                data.updatedAt
            )

            return ok(newCompany)
        } catch (error) {
            if (
                error instanceof ErrorInvalidCompanyContact ||
                error instanceof ErrorInvalidCompanyName ||
                error instanceof ErrorInvalidPhoneNumber ||
                error instanceof ErrorInvalidEmail
            ) {
                return err(error)
            }

            throw error
        }
    }

    constructor(
        private _id: CompanyId,
        private _fingerprint: CompanyFingerprint,
        private _name: CompanyName,
        private _address: Address,
        private _legalStatus: CompanyLegalStatus,
        private _contactPhone: Phone,
        private _contactEmail: Email,
        private _createdAt: Date,
        private _updatedAt: Date
    ) {}

    get id() {
        return this._id
    }

    get createdAt() {
        return this._createdAt
    }

    get data() {
        return {
            id: this._id,
            fingerprint: this._fingerprint,
            name: this._name.value,
            address: this._address,
            legalStatus: this._legalStatus,
            contact: {
                phone: this._contactPhone.value,
                email: this._contactEmail.value,
            },
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        }
    }
}

export class CompanyName {
    private constructor(readonly value: string) {}

    static of(value: string) {
        const isValidName = this.validateCompanyName(value)
        if (!isValidName) {
            throw new ErrorInvalidCompanyName()
        }
        return new CompanyName(value)
    }

    private static validateCompanyName(name: string): boolean {
        return !!name && name.length > 0 && name.length <= 255
    }
}
