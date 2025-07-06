import type { ForManagingDates } from "../ForManagingDates"

export class StubDateProvider implements ForManagingDates {
    time!: Date

    now(): Date {
        return this.time
    }
}
