import { StubDateProvider } from "../StubDateProvider"

export function createDateFixture() {
    const dateProvider = new StubDateProvider()

    function givenNowIs(date: Date) {
        dateProvider.time = date
    }

    return {
        dateProvider,
        givenNowIs,
    }
}

export type DateFixture = ReturnType<typeof createDateFixture>
