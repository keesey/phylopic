import { LicenseURL, ValidLicenseURL } from "@phylopic/utils"
import { PERMITTED_LICENSE_CHANGES } from "../constants/PERMITTED_LICENSE_CHANGES"
export const canChange = (a: LicenseURL, b: ValidLicenseURL) => {
    if (a === b) {
        return true
    }
    return PERMITTED_LICENSE_CHANGES[a].indexOf(b) >= 0
}
