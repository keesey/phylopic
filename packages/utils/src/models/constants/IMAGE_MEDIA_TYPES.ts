import { ImageMediaType } from "../types/ImageMediaType"
import { RASTER_MEDIA_TYPES } from "./RASTER_MEDIA_TYPES"
import { VECTOR_MEDIA_TYPES } from "./VECTOR_MEDIA_TYPES"
export const IMAGE_MEDIA_TYPES: ReadonlySet<ImageMediaType> = new Set<ImageMediaType>([
    ...Array.from(RASTER_MEDIA_TYPES),
    ...Array.from(VECTOR_MEDIA_TYPES),
])
