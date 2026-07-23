import { invalidate } from "../../validation/invalidate"
import { type ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { EXTENDED_LICENSE_URLS } from "../constants"
import { ExtendedLicenseURL } from "../types"
const VALIDATION_MESSAGE = `Expected one of the following license URLs: ${Array.from(EXTENDED_LICENSE_URLS)
    .sort()
    .join(", ")}.`
export const isExtendedLicenseURL = (x: unknown, faultCollector?: ValidationFaultCollector): x is ExtendedLicenseURL =>
    EXTENDED_LICENSE_URLS.has(x as ExtendedLicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
