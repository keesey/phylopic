import { validate } from "email-validator"
import { FaultDetector } from "../../detection/FaultDetector"
import invalidate from "../../validation/invalidate"
import type { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { EmailAddress } from "../types/EmailAddress"
export const isEmailAddress: FaultDetector<EmailAddress> = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is EmailAddress =>
    (typeof x === "string" && validate(x)) || invalidate(faultCollector, "Not a valid email address.")
export default isEmailAddress
