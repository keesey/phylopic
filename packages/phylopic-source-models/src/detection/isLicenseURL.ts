import { LICENSE_URLS } from "../constants/LICENSE_URLS"
import { LicenseURL } from "../models/LicenseURL"

export const isLicenseURL = (x: unknown): x is LicenseURL => LICENSE_URLS.includes(x as LicenseURL)
