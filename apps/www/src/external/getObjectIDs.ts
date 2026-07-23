import type { NodeLinks } from "@phylopic/api-models"
import type { Authority, Namespace } from "@phylopic/utils"
const getObjectIDs = (links: NodeLinks, authority: Authority, namespace: Namespace) => {
    const prefix = `/resolve/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}/`
    return links.external
        ?.filter(({ href }) => href.startsWith(prefix))
        .map(({ href }) => href.slice(prefix.length).split("?", 2)[0])
        .filter(Boolean)
        .map(s => decodeURIComponent(s))
}
export default getObjectIDs
