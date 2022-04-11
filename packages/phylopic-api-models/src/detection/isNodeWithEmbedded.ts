import { isTypeOrUndefined } from "phylopic-utils/src/types"
import { NodeEmbedded } from "~/types/NodeWithEmbedded"
import { NodeWithEmbedded } from "../types"
import isImage from "./isImage"
import isNode from "./isNode"
import isNodeArray from "./isNodeArray"
const isNodeEmbedded = (x: unknown): x is NodeEmbedded =>
    typeof x === "object" &&
    x !== null &&
    isTypeOrUndefined((x as NodeEmbedded).childNodes, isNodeArray) &&
    isTypeOrUndefined((x as NodeEmbedded).parentNode, isNode) &&
    isTypeOrUndefined((x as NodeEmbedded).primaryImage, isImage)
export const isNodeWithEmbedded = (x: unknown): x is NodeWithEmbedded =>
    isNode(x) && isNodeEmbedded((x as NodeWithEmbedded)._embedded)
export default isNodeWithEmbedded
