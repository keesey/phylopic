import { invalidate, ValidationFaultCollector } from "phylopic-utils/src"
import { DATA_MEDIA_TYPE } from ".."
import { DataMediaType } from "../types/DataMediaType"
const VALIDATION_MESSAGE = `Expected "${DATA_MEDIA_TYPE}".`
export const isDataMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is DataMediaType =>
    x === DATA_MEDIA_TYPE || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isDataMediaType
