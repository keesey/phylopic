import { version } from "uuid"
import { UUID } from "../types/UUID"
import { isUUID } from "./isUUID"
export const isUUIDv4 = (value: unknown): value is UUID => isUUID(value) && version(value) === 4
export default isUUIDv4
