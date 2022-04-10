import { validate } from "email-validator"
import { EmailAddress } from "../models/EmailAddress"

export const isEmailAddress = (value: unknown): value is EmailAddress => typeof value === "string" && validate(value)
