export class Phone {
    private constructor(public readonly value: string) {}

    static of(value: string) {
        const isValidPhone = this.validatePhone(value)
        if (!isValidPhone) {
            throw new ErrorInvalidPhoneNumber()
        }
        return new Phone(value)
    }

    private static validatePhone(phone: string): boolean {
        const phoneRegex = /^\+[0-9]{1,3}\.[0-9]{3,}$/
        return phoneRegex.test(phone)
    }
}

export class ErrorInvalidPhoneNumber extends Error {}
