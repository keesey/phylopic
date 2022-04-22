import { Entity, Node } from "phylopic-source-models/src"
import { UUID } from "phylopic-utils/src"
import { CLIData } from "~/cli/getCLIData"
const succeeds = (nodes: CLIData["nodes"], predecessorUUID: UUID, entity: Entity<Node>): boolean => {
    if (entity.uuid === predecessorUUID) {
        return true
    }
    const parentUUID = entity.value.parent
    if (!parentUUID) {
        return false
    }
    const parent = nodes.get(parentUUID)
    if (!parent) {
        return false
    }
    return succeeds(nodes, predecessorUUID, { uuid: parentUUID, value: parent })
}
export default succeeds
