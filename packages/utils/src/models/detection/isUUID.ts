import { validate } from "uuid"
import invalidate from "../../validation/invalidate"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector"
import { UUID } from "../types/UUID"
export const isUUID = (value: unknown, faultCollector?: ValidationFaultCollector): value is UUID =>
    (typeof value === "string" && validate(value)) || invalidate(faultCollector, "Not a valid UUID.")
export default isUUID
