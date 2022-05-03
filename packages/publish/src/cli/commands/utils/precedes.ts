import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
const precedes = (nodes: ReadonlyMap<UUID, Node>, predecessor: UUID, successor: UUID): boolean => {
    if (predecessor === successor) {
        return true
    }
    const parent = nodes.get(successor)?.parent
    if (!parent) {
        return false
    }
    return precedes(nodes, predecessor, parent)
}
export default precedes
