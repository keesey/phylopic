import { ValidLicenseURL } from "../types/ValidLicenseURL"
import PUBLIC_DOMAIN_LICENSE_URLS from "./PUBLIC_DOMAIN_LICENSE_URLS"
export const VALID_LICENSE_URLS: ReadonlySet<ValidLicenseURL> = new Set([
    ...PUBLIC_DOMAIN_LICENSE_URLS,
    "https://creativecommons.org/licenses/by/4.0/",
])
export default VALID_LICENSE_URLS
