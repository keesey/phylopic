import RASTER_MEDIA_TYPES from "../constants/RASTER_MEDIA_TYPES"
import { RasterMediaType } from "../types/RasterMediaType"
export const isRasterMediaType = (x: unknown): x is RasterMediaType => RASTER_MEDIA_TYPES.has(x as RasterMediaType)
export default isRasterMediaType
