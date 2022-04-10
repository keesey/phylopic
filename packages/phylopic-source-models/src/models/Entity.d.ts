import { UUID } from "./UUID"

export type Entity<T> = {
    uuid: UUID
    value: T
}
