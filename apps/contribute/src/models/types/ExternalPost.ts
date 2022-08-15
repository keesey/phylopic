import { Authority, Namespace, ObjectID } from "@phylopic/utils"
export type ExternalPost = {
    readonly authority: Authority
    readonly namespace: Namespace
    readonly objectID: ObjectID
}
