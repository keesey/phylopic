import { validate } from "uuid"
import { UUID } from "../types/UUID"
export const isUUID = (value: unknown): value is UUID => typeof value === "string" && validate(value)
export default isUUID
