export class Email {
    private constructor(public readonly value: string) {}

    static of(value: string) {
        const isValidEmail = this.validateEmail(value)
        if (!isValidEmail) {
            throw new ErrorInvalidEmail()
        }
        return new Email(value)
    }

    private static validateEmail(email: string): boolean {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return emailRegex.test(email)
    }
}

export class ErrorInvalidEmail extends Error {}
