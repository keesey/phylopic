import { LicenseURL } from "../types/LicenseURL.js"
import LEGACY_LICENSE_URLS from "./LEGACY_LICENSE_URLS.js"
import VALID_LICENSE_URLS from "./VALID_LICENSE_URLS.js"
export const LICENSE_URLS: ReadonlySet<LicenseURL> = new Set([...VALID_LICENSE_URLS, ...LEGACY_LICENSE_URLS])
export default LICENSE_URLS
