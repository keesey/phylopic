import { Node } from "@phylopic/api-models"
import { getNodeLineageLinks } from "./getNodeLineageLinks"
export const getConcestorLink = async (nodes: Iterable<Pick<Node, "_links">>) => {
    const nodeArray = Array.from(nodes)
    if (nodeArray.length === 0) {
        return null
    }
    if (nodeArray.length === 1) {
        return nodeArray[0]._links.self
    }
    const [firstLineage, ...otherLineages] = await Promise.all(nodeArray.map(node => getNodeLineageLinks(node)))
    for (const link of firstLineage) {
        if (otherLineages.every(other => other.some(otherLink => otherLink.href === link.href))) {
            return link
        }
    }
    return null
}
