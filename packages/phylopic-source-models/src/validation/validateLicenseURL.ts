import { LICENSE_URLS } from "../constants/LICENSE_URLS"
import { LicenseURL } from "../models/LicenseURL"

export const validateLicenseURL = (value: LicenseURL) => {
    if (!value || !LICENSE_URLS.includes(value)) {
        throw new Error(`Not a valid license URL: ${value}`)
    }
}
