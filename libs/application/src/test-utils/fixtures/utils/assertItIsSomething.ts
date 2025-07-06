export function assertItIsSomething(value: unknown): asserts value is {} {
    if (value === undefined || value === null) {
        throw new Error("Value is undefined or null")
    }
}
