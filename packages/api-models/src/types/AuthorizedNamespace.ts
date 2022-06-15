import { Authority, Namespace } from "@phylopic/utils"

export interface AuthorizedNamespace {
    readonly authority: Authority
    readonly namespace: Namespace
}
