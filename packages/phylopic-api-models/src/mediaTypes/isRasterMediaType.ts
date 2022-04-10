import { RASTER_MEDIA_TYPES } from "."
import { RasterMediaType } from "./RasterMediaType"
export const isRasterMediaType = (x: unknown): x is RasterMediaType => RASTER_MEDIA_TYPES.has(x as RasterMediaType)
export default isRasterMediaType
