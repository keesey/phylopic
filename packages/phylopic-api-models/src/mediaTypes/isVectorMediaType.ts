import { VECTOR_MEDIA_TYPES } from "."
import { VectorMediaType } from "./VectorMediaType"
export const isVectorMediaType = (x: unknown): x is VectorMediaType => VECTOR_MEDIA_TYPES.has(x as VectorMediaType)
export default isVectorMediaType
