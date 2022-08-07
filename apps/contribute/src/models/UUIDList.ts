import { UUID } from "@phylopic/utils"
export type UUIDList = Readonly<{
    nextToken?: string
    uuids: readonly UUID[]
}>
