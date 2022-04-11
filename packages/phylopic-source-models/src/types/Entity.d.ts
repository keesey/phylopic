import { UUID } from "phylopic-utils/src/models/types"
export type Entity<T> = {
    uuid: UUID
    value: T
}
