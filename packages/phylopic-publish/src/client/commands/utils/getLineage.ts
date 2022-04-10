import { Entity, Node, UUID } from "phylopic-source-models/src"
const getLineage = (nodes: ReadonlyMap<UUID, Node>, sink: UUID, source?: UUID): ReadonlyArray<Entity<Node>> => {
    const value = nodes.get(sink)
    if (!value) {
        return []
    }
    if (sink === source || !value.parent) {
        return [{ uuid: sink, value }]
    }
    return [...getLineage(nodes, value.parent, source), { uuid: sink, value }]
}
export default getLineage
