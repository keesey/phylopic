import { validate } from "email-validator"
import { FaultDetector } from "../../detection"
import { invalidate, ValidationFaultCollector } from "../../validation"
import { EmailAddress } from "../types"
export const isEmailAddress: FaultDetector<EmailAddress> = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is EmailAddress =>
    (typeof x === "string" && validate(x)) || invalidate(faultCollector, "Not a valid email address.")
export default isEmailAddress
