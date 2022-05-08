import { ImageMediaType } from "../types/ImageMediaType.js"
import RASTER_MEDIA_TYPES from "./RASTER_MEDIA_TYPES.js"
import VECTOR_MEDIA_TYPES from "./VECTOR_MEDIA_TYPES.js"
export const IMAGE_MEDIA_TYPES: ReadonlySet<ImageMediaType> = new Set([...RASTER_MEDIA_TYPES, ...VECTOR_MEDIA_TYPES])
export default IMAGE_MEDIA_TYPES
