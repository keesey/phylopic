import { UUID } from "phylopic-utils"
export type Entity<T> = {
    uuid: UUID
    value: T
}
