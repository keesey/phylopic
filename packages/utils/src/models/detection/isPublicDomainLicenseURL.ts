import { invalidate, ValidationFaultCollector } from "../../validation"
import { PUBLIC_DOMAIN_LICENSE_URLS } from "../constants"
import { PublicDomainLicenseURL } from "../types"
const VALIDATION_MESSAGE = `Expected one of the following public domain license URLs: ${[...PUBLIC_DOMAIN_LICENSE_URLS]
    .sort()
    .join(", ")}.`
export const isPublicDomainLicenseURL = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is PublicDomainLicenseURL =>
    PUBLIC_DOMAIN_LICENSE_URLS.has(x as PublicDomainLicenseURL) || invalidate(faultCollector, VALIDATION_MESSAGE)
export default isPublicDomainLicenseURL
