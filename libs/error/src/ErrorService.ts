export type Result<T, E> = Err<T, E> | Ok<T, E>

export const ok = <T, E = never>(value: T): Ok<T, E> => new Ok(value)

export const err = <T = never, E = unknown>(error: E): Err<T, E> =>
    new Err(error)

export class Ok<T, E> {
    constructor(public readonly value: T) {}

    public isOk(): this is Ok<T, E> {
        return true
    }

    public isErr(): this is Err<T, E> {
        return !this.isOk()
    }
}

export class Err<T, E> {
    constructor(public readonly error: E) {}

    public isOk(): this is Ok<T, E> {
        return false
    }

    public isErr(): this is Err<T, E> {
        return !this.isOk()
    }
}

export function assertItIsOk(
    value: unknown
): asserts value is InstanceType<typeof Ok> {
    if (!(value instanceof Ok)) {
        throw new Error("Not an Ok result")
    }
}

export function assertItIsErr(
    value: unknown
): asserts value is InstanceType<typeof Err> {
    if (!(value instanceof Err)) {
        throw new Error("Not an Err result")
    }
}

export function keepOnlyOkValues<T, E>(values: Result<T, E>[]) {
    return values.filter((value) => value.isOk()).map((value) => value.value)
}

export function keepFirstItem<T>(values: T[]) {
    return values[0]
}
