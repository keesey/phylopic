import { LicenseURL } from "../types/LicenseURL"
import { LEGACY_LICENSE_URLS } from "./LEGACY_LICENSE_URLS"
import { VALID_LICENSE_URLS } from "./VALID_LICENSE_URLS"
export const LICENSE_URLS: ReadonlySet<LicenseURL> = new Set([
    ...Array.from(VALID_LICENSE_URLS),
    ...Array.from(LEGACY_LICENSE_URLS),
])
