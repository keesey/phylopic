import { isTypeOrUndefined } from "phylopic-utils/src/types"
import { ImageEmbedded } from "~/types/ImageWithEmbedded"
import { ImageWithEmbedded } from "../types"
import isImage from "./isImage"
import isNode from "./isNode"
import isNodeArray from "./isNodeArray"
const isImageEmbedded = (x: unknown): x is ImageEmbedded =>
    typeof x === "object" &&
    x !== null &&
    isTypeOrUndefined((x as ImageEmbedded).generalNode, isNode) &&
    isTypeOrUndefined((x as ImageEmbedded).nodes, isNodeArray) &&
    isTypeOrUndefined((x as ImageEmbedded).specificNode, isNode)
export const isImageWithEmbedded = (x: unknown): x is ImageWithEmbedded =>
    isImage(x) && isImageEmbedded((x as ImageWithEmbedded)._embedded)
export default isImageWithEmbedded
