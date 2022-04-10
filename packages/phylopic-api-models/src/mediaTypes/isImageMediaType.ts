import { IMAGE_MEDIA_TYPES } from "."
import { ImageMediaType } from "./ImageMediaType"
export const isImageMediaType = (x: unknown): x is ImageMediaType => IMAGE_MEDIA_TYPES.has(x as ImageMediaType)
export default isImageMediaType
