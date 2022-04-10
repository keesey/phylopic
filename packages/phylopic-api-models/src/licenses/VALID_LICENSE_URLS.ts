import { ValidLicenseURL } from "./ValidLicenseURL"
export const VALID_LICENSE_URLS: ReadonlySet<ValidLicenseURL> = new Set([
    "https://creativecommons.org/publicdomain/zero/1.0/",
    "https://creativecommons.org/publicdomain/mark/1.0/",
    "https://creativecommons.org/licenses/by/4.0/",
])
export default VALID_LICENSE_URLS
