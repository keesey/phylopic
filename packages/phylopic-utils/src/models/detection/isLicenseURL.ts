import LICENSE_URLS from "../constants/LICENSE_URLS"
import { LicenseURL } from "../types/LicenseURL"
export const isLicenseURL = (x: unknown): x is LicenseURL => LICENSE_URLS.has(x as LicenseURL)
export default isLicenseURL
