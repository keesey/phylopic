import { Entity, Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"

const getLineage = async (uuid: UUID) => {
    const result = await fetch(`/api/lineage/${uuid}`)
    if (!result.ok) {
        throw new Error(result.statusText)
    }
    const entities: readonly Entity<Node>[] = await result.json()
    return entities
}
export default getLineage
