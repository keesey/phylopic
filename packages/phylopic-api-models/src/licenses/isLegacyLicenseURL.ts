import { LegacyLicenseURL } from "./LegacyLicenseURL"
import LEGACY_LICENSE_URLS from "./LEGACY_LICENSE_URLS"
export const isLegacyLicenseURL = (x: unknown): x is LegacyLicenseURL => LEGACY_LICENSE_URLS.has(x as LegacyLicenseURL)
export default isLegacyLicenseURL
