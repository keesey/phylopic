import { LicenseURL } from "./LicenseURL"
import LICENSE_URLS from "./LICENSE_URLS"
export const isLicenseURL = (x: unknown): x is LicenseURL => LICENSE_URLS.has(x as LicenseURL)
export default isLicenseURL
