import PUBLIC_DOMAIN_LICENSE_URLS from "../constants/PUBLIC_DOMAIN_LICENSE_URLS"
import { PublicDomainLicenseURL } from "../types/PublicDomainLicenseURL"
export const isPublicDomainLicenseURL = (x: unknown): x is PublicDomainLicenseURL =>
    PUBLIC_DOMAIN_LICENSE_URLS.has(x as PublicDomainLicenseURL)
export default isPublicDomainLicenseURL
