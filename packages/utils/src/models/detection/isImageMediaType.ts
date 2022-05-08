import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import IMAGE_MEDIA_TYPES from "../constants/IMAGE_MEDIA_TYPES.js"
import { ImageMediaType } from "../types/ImageMediaType.js"
const VALIDATION_MESSAGE = `Expected one of the following image media types: ${[...IMAGE_MEDIA_TYPES]
    .sort()
    .join(", ")}.`
export const isImageMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is ImageMediaType =>
    IMAGE_MEDIA_TYPES.has(x as ImageMediaType) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isImageMediaType
