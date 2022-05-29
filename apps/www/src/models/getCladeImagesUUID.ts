import { Node } from "@phylopic/api-models"
import { extractQueryString, parseQueryString } from "@phylopic/utils"
const getCladeImagesUUID = (node: Node) => {
    return parseQueryString(extractQueryString(node._links.cladeImages?.href ?? "")).filter_clade || node.uuid
}
export default getCladeImagesUUID
