import { Authority, Namespace, Nomen, ObjectID } from "@phylopic/utils"
export type SearchEntry = Readonly<{
    readonly authority: Authority
    readonly namespace: Namespace
    readonly objectID: ObjectID
    readonly name: Nomen
}>
