import { invalidate } from "../../validation/invalidate"
import { type ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { IMAGE_MEDIA_TYPES } from "../constants/IMAGE_MEDIA_TYPES"
import { ImageMediaType } from "../types/ImageMediaType"
const VALIDATION_MESSAGE = `Expected one of the following image media types: ${[...IMAGE_MEDIA_TYPES]
    .sort()
    .join(", ")}.`
export const isImageMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is ImageMediaType =>
    IMAGE_MEDIA_TYPES.has(x as ImageMediaType) || invalidate(faultCollector, VALIDATION_MESSAGE)
