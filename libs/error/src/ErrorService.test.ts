import { describe, it, expect } from "vitest"
import { ok, err, Ok, Err, type Result } from "./ErrorService"

describe("ErrorService", () => {
    describe("ok", () => {
        it(`should return an Ok instance`, () => {
            const result = ok(1)
            expect(result).toBeInstanceOf(Ok)
            expect(result.isOk()).toBe(true)
            expect(result.isErr()).toBe(false)
        })
    })

    describe("err", () => {
        it(`should return an Err instance`, () => {
            const result = err(1)
            expect(result).toBeInstanceOf(Err)
            expect(result.isOk()).toBe(false)
            expect(result.isErr()).toBe(true)
        })
    })
})
