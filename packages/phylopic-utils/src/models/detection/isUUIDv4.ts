import { version } from "uuid"
import { invalidate, ValidationFaultCollector } from "../../validation"
import { UUID } from "../types"
import { isUUID } from "./isUUID"
export const isUUIDv4 = (value: unknown, faultCollector?: ValidationFaultCollector): value is UUID =>
    (isUUID(value) && version(value) === 4) || invalidate(faultCollector, "Expected a valid UUID (version 4).")
export default isUUIDv4
