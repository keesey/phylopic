import { UUID } from "phylopic-utils/src"
export type Entity<T> = {
    uuid: UUID
    value: T
}
