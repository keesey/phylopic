import LEGACY_LICENSE_URLS from "../constants/LEGACY_LICENSE_URLS"
import { LegacyLicenseURL } from "../types/LegacyLicenseURL"
export const isLegacyLicenseURL = (x: unknown): x is LegacyLicenseURL => LEGACY_LICENSE_URLS.has(x as LegacyLicenseURL)
export default isLegacyLicenseURL
