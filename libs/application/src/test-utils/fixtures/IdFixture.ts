import { StubIdProvider } from "../StubIdProvider"

export function createIdFixture() {
    const idProvider = new StubIdProvider()

    function givenTheIdIs(id: string) {
        idProvider.id = id
    }

    function givenTheFingerPrintIs(fingerPrint: string) {
        idProvider.fingerPrint = fingerPrint
    }

    return {
        idProvider,
        givenTheIdIs,
        givenTheFingerPrintIs,
    }
}

export type IdFixture = ReturnType<typeof createIdFixture>
