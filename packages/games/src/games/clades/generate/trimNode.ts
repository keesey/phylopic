import type { NodeWithEmbedded } from "@phylopic/api-models"
import type { CladesGameNode } from "./CladesGame"
export const trimNode = (node: NodeWithEmbedded | CladesGameNode): CladesGameNode => {
    return {
        _embedded: {
            primaryImage: node._embedded.primaryImage,
        },
        _links: {
            lineage: node._links.lineage,
            self: node._links.self,
        },
        names: node.names,
        uuid: node.uuid,
    }
}
