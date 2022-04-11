import VECTOR_MEDIA_TYPES from "../constants/VECTOR_MEDIA_TYPES"
import { VectorMediaType } from "../types"
export const isVectorMediaType = (x: unknown): x is VectorMediaType => VECTOR_MEDIA_TYPES.has(x as VectorMediaType)
export default isVectorMediaType
