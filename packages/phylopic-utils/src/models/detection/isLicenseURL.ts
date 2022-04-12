import invalidate from "../../validation/invalidate"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import LICENSE_URLS from "../constants/LICENSE_URLS"
import { LicenseURL } from "../types/LicenseURL"
const VALIDATION_MESSAGE = `Expected one of the following license URLs: ${[...LICENSE_URLS].sort().join(", ")}.`
export const isLicenseURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is LicenseURL =>
    LICENSE_URLS.has(x as LicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isLicenseURL
