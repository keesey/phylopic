import { AuthorizedNamespace } from "./AuthorizedNamespace"
import { Data } from "./Data"
export interface AuthorizedNamespaces extends Data {
    readonly namespaces: readonly AuthorizedNamespace[]
}
