import type { ForGeneratingAnId } from "../ForGeneratingAnId"

export class StubIdProvider implements ForGeneratingAnId {
    public id: string = ""
    public fingerPrint: string = ""
    
    public generate(): string {
        return this.id
    }

    public generateFingerPrint(): string {
        return this.fingerPrint
    }
}
