import { LicenseURL } from "./LicenseURL"
import PERMITTED_LICENSE_CHANGES from "./PERMITTED_LICENSE_CHANGES"
import { ValidLicenseURL } from "./ValidLicenseURL"
export const canChange = (a: LicenseURL, b: ValidLicenseURL) => {
    if (a === b) {
        return true
    }
    return PERMITTED_LICENSE_CHANGES[a].indexOf(b) >= 0
}
export default canChange
