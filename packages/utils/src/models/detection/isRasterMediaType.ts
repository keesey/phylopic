import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import RASTER_MEDIA_TYPES from "../constants/RASTER_MEDIA_TYPES.js"
import { RasterMediaType } from "../types/RasterMediaType.js"
const VALIDATION_MESSAGE = `Expected one of the following raster image media types: ${[...RASTER_MEDIA_TYPES]
    .sort()
    .join(", ")}.`
export const isRasterMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is RasterMediaType =>
    RASTER_MEDIA_TYPES.has(x as RasterMediaType) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isRasterMediaType
