import invalidate from "../../validation/invalidate"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { version } from "uuid"
import { UUID } from "../types/UUID"
import { isUUID } from "./isUUID"
export const isUUIDv4 = (value: unknown, faultCollector?: ValidationFaultCollector): value is UUID =>
    (isUUID(value) && version(value) === 4) || invalidate(faultCollector, "Expected a valid UUID (version 4).")
export default isUUIDv4
