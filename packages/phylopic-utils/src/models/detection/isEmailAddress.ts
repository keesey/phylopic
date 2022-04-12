import { validate } from "email-validator"
import invalidate from "../../validation/invalidate"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { EmailAddress } from "../types/EmailAddress"
export const isEmailAddress = (value: unknown, faultCollector?: ValidationFaultCollector): value is EmailAddress =>
    (typeof value === "string" && validate(value)) || invalidate(faultCollector, "Not a valid email address.")
