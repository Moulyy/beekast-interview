export class ErrorNotFound extends Error {
    public readonly name = "NotFound"

    constructor(message?: string) {
        super(message)
    }
}
