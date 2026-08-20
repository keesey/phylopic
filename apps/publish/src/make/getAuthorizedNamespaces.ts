import { AuthorizedNamespace } from "@phylopic/api-models"
import type { SourceData } from "./getSourceData.js"

const compareAuthorizedNamespaces = (a: AuthorizedNamespace, b: AuthorizedNamespace) =>
    a.authority.localeCompare(b.authority) || a.namespace.localeCompare(b.namespace)

const getAuthorizedNamespaces = (data: SourceData): readonly AuthorizedNamespace[] => {
    const seen = new Set<string>()
    const namespaces: AuthorizedNamespace[] = []
    for (const identifier of data.externals.keys()) {
        const [authority, namespace] = identifier.split("/", 3).map(decodeURIComponent)
        const key = `${authority}\0${namespace}`
        if (seen.has(key)) {
            continue
        }
        seen.add(key)
        namespaces.push({ authority, namespace })
    }
    return namespaces.sort(compareAuthorizedNamespaces)
}

export default getAuthorizedNamespaces
