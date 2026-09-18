import type { AuthorizedNamespace } from "./AuthorizedNamespace"
import type { Data } from "./Data"

export interface AuthorizedNamespaces extends Data {
    readonly namespaces: readonly AuthorizedNamespace[]
}
