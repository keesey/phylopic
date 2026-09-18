import { invalidate, type ValidationFaultCollector } from "@phylopic/utils"
import { DATA_MEDIA_TYPE } from "../constants/DATA_MEDIA_TYPE"
import type { DataMediaType } from "../types/DataMediaType"

const VALIDATION_MESSAGE = `Expected "${DATA_MEDIA_TYPE}".`

export const isDataMediaType = (x: unknown, faultCollector?: ValidationFaultCollector): x is DataMediaType =>
    x === DATA_MEDIA_TYPE || invalidate(faultCollector, VALIDATION_MESSAGE)
