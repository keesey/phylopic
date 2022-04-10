import { LicenseURL } from "../models/LicenseURL"
import { LEGACY_LICENSE_URLS } from "./LEGACY_LICENSE_URLS"
import { VALID_LICENSE_URLS } from "./VALID_LICENSE_URLS"

export const LICENSE_URLS: readonly LicenseURL[] = [...VALID_LICENSE_URLS, ...LEGACY_LICENSE_URLS]
