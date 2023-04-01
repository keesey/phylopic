import { Node } from "@phylopic/api-models"
import getNodeSlug from "~/routes/getNodeSlug"
import getCladeImagesUUID from "./getCladeImagesUUID"
const getCladeImagesHRef = (node: Node) => {
    return `/nodes/${getCladeImagesUUID(node)}/${getNodeSlug(node._links.cladeImages?.title ?? "")}`
}
export default getCladeImagesHRef
