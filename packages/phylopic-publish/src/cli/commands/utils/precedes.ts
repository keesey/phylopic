import { Node, UUID } from "phylopic-source-models/src"
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
