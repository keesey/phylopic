import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import VALID_LICENSE_URLS from "../constants/VALID_LICENSE_URLS.js"
import { ValidLicenseURL } from "../types/ValidLicenseURL.js"
const VALIDATION_MESSAGE = `Expected one of the following license URLs: ${[...VALID_LICENSE_URLS].sort().join(", ")}.`
export const isValidLicenseURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is ValidLicenseURL =>
    VALID_LICENSE_URLS.has(x as ValidLicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isValidLicenseURL
