import { Node } from "@phylopic/api-models"
import { isUUID } from "@phylopic/utils"
import getCladeImagesUUID from "./getCladeImagesUUID"
const nodeHasOwnCladeImages = (node: Node) => {
    const cladeImagesUUID = getCladeImagesUUID(node)
    if (cladeImagesUUID !== node.uuid && isUUID(cladeImagesUUID)) {
        return false
    }
    return true
}
export default nodeHasOwnCladeImages
