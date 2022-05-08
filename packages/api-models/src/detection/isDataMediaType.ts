import { invalidate, ValidationFaultCollector } from "@phylopic/utils"
import DATA_MEDIA_TYPE from "../constants/DATA_MEDIA_TYPE.js"
import { DataMediaType } from "../types/DataMediaType.js"
const VALIDATION_MESSAGE = `Expected "${DATA_MEDIA_TYPE}".`
export const isDataMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is DataMediaType =>
    x === DATA_MEDIA_TYPE || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isDataMediaType
