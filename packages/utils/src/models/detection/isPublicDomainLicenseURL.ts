import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import PUBLIC_DOMAIN_LICENSE_URLS from "../constants/PUBLIC_DOMAIN_LICENSE_URLS.js"
import { PublicDomainLicenseURL } from "../types/PublicDomainLicenseURL.js"
const VALIDATION_MESSAGE = `Expected one of the following public domain license URLs: ${[...PUBLIC_DOMAIN_LICENSE_URLS]
    .sort()
    .join(", ")}.`
export const isPublicDomainLicenseURL = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is PublicDomainLicenseURL =>
    PUBLIC_DOMAIN_LICENSE_URLS.has(x as PublicDomainLicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isPublicDomainLicenseURL
