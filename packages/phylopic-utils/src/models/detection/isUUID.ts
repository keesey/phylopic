import { validate } from "uuid"
import { invalidate, ValidationFaultCollector } from "../../validation"
import { UUID } from "../types"
export const isUUID = (value: unknown, faultCollector?: ValidationFaultCollector): value is UUID =>
    (typeof value === "string" && validate(value)) || invalidate(faultCollector, "Not a valid UUID.")
export default isUUID
