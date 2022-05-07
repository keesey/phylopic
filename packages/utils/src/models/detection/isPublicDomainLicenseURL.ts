import invalidate from "../../validation/invalidate"
import type { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import PUBLIC_DOMAIN_LICENSE_URLS from "../constants/PUBLIC_DOMAIN_LICENSE_URLS"
import { PublicDomainLicenseURL } from "../types/PublicDomainLicenseURL"
const VALIDATION_MESSAGE = `Expected one of the following public domain license URLs: ${[...PUBLIC_DOMAIN_LICENSE_URLS]
    .sort()
    .join(", ")}.`
export const isPublicDomainLicenseURL = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is PublicDomainLicenseURL =>
    PUBLIC_DOMAIN_LICENSE_URLS.has(x as PublicDomainLicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isPublicDomainLicenseURL
