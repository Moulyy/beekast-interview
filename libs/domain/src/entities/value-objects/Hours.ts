type Digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type MustBeTwoDigits<T extends string> = T extends `${Digits}${Digits}`
    ? T
    : never
type Hours = `${0 | 1}${Digits}` | `2${0 | 1 | 2 | 3}`
type Minutes = `${0 | 1 | 2 | 3 | 4 | 5}${Digits}`
export type HoursAndMinutes = `${MustBeTwoDigits<Hours>}:${MustBeTwoDigits<Minutes>}`