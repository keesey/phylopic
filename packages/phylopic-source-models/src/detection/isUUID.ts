import { validate } from "uuid"
import { UUID } from "../models/UUID"

export const isUUID = (value: unknown): value is UUID => typeof value === "string" && validate(value)
