import { LEGACY_LICENSE_URLS } from "../constants/LEGACY_LICENSE_URLS"
import { LegacyLicenseURL } from "../models/LegacyLicenseURL"

export const isLegacyLicenseURL = (x: unknown): x is LegacyLicenseURL =>
    typeof x === "string" && LEGACY_LICENSE_URLS.includes(x as LegacyLicenseURL)
