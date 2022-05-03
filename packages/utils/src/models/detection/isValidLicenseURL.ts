import { invalidate, ValidationFaultCollector } from "../../validation"
import { VALID_LICENSE_URLS } from "../constants"
import { ValidLicenseURL } from "../types"
const VALIDATION_MESSAGE = `Expected one of the following license URLs: ${[...VALID_LICENSE_URLS].sort().join(", ")}.`
export const isValidLicenseURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is ValidLicenseURL =>
    VALID_LICENSE_URLS.has(x as ValidLicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isValidLicenseURL
