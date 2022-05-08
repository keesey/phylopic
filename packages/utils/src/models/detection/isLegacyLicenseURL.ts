import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import LEGACY_LICENSE_URLS from "../constants/LEGACY_LICENSE_URLS.js"
import { LegacyLicenseURL } from "../types/LegacyLicenseURL.js"
const VALIDATION_MESSAGE = `Expected one of the following license URLs: ${[...LEGACY_LICENSE_URLS].sort().join(", ")}.`
export const isLegacyLicenseURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is LegacyLicenseURL =>
    LEGACY_LICENSE_URLS.has(x as LegacyLicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isLegacyLicenseURL
