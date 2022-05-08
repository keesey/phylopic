import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import LICENSE_URLS from "../constants/LICENSE_URLS.js"
import { LicenseURL } from "../types/LicenseURL.js"
const VALIDATION_MESSAGE = `Expected one of the following license URLs: ${[...LICENSE_URLS].sort().join(", ")}.`
export const isLicenseURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is LicenseURL =>
    LICENSE_URLS.has(x as LicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isLicenseURL
