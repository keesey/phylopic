import { ImageMediaType } from "./ImageMediaType"
import RASTER_MEDIA_TYPES from "./RASTER_MEDIA_TYPES"
import VECTOR_MEDIA_TYPES from "./VECTOR_MEDIA_TYPES"
export const IMAGE_MEDIA_TYPES: ReadonlySet<ImageMediaType> = new Set([...RASTER_MEDIA_TYPES, ...VECTOR_MEDIA_TYPES])
export default IMAGE_MEDIA_TYPES
