import { ExtendedLicenseURL } from "../types"
import LICENSE_URLS from "./LICENSE_URLS"
export const EXTENDED_LICENSE_URLS: ReadonlySet<ExtendedLicenseURL> = new Set<ExtendedLicenseURL>([
    ...Array.from(LICENSE_URLS),
    "https://creativecommons.org/licenses/by-nc/4.0/",
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "https://creativecommons.org/licenses/by-sa/4.0/",
])
export default EXTENDED_LICENSE_URLS
