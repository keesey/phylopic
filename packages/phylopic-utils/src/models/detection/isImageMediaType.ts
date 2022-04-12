import { invalidate, ValidationFaultCollector } from "../../validation"
import { IMAGE_MEDIA_TYPES } from "../constants"
import { ImageMediaType } from "../types"
const VALIDATION_MESSAGE = `Expected one of the following image media types: ${[...IMAGE_MEDIA_TYPES]
    .sort()
    .join(", ")}.`
export const isImageMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is ImageMediaType =>
    IMAGE_MEDIA_TYPES.has(x as ImageMediaType) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isImageMediaType
