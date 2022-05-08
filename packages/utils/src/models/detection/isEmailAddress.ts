import { validate } from "email-validator"
import { FaultDetector } from "../../detection/FaultDetector.js"
import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import { EmailAddress } from "../types/EmailAddress.js"
export const isEmailAddress: FaultDetector<EmailAddress> = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is EmailAddress =>
    (typeof x === "string" && validate(x)) || invalidate(faultCollector, "Not a valid email address.")
export default isEmailAddress
