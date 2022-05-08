import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import VECTOR_MEDIA_TYPES from "../constants/VECTOR_MEDIA_TYPES.js"
import { VectorMediaType } from "../types/VectorMediaType.js"
const VALIDATION_MESSAGE = `Expected one of the following vector image media types: ${[...VECTOR_MEDIA_TYPES]
    .sort()
    .join(", ")}.`
export const isVectorMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is VectorMediaType =>
    VECTOR_MEDIA_TYPES.has(x as VectorMediaType) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isVectorMediaType