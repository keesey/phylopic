import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { invalidate } from "@phylopic/utils/dist/validation"
import DATA_MEDIA_TYPE from "../constants/DATA_MEDIA_TYPE"
import { DataMediaType } from "../types/DataMediaType"
const VALIDATION_MESSAGE = `Expected "${DATA_MEDIA_TYPE}".`
export const isDataMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is DataMediaType =>
    x === DATA_MEDIA_TYPE || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isDataMediaType
