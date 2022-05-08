import { version } from "uuid"
import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import { UUID } from "../types/UUID.js"
import { isUUID } from "./isUUID.js"
export const isUUIDv4 = (value: unknown, faultCollector?: ValidationFaultCollector): value is UUID =>
    (isUUID(value) && version(value) === 4) || invalidate(faultCollector, "Expected a valid UUID (version 4).")
export default isUUIDv4
