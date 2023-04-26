import { ExtendedLicenseURL } from "@phylopic/utils"
import { LicenseFlags } from "./LicenseFlags"
const getLicenseForFlags = ({ by, nc, sa, v4 }: LicenseFlags): ExtendedLicenseURL => {
    if (by) {
        return getLicenseForByFlags({ nc, sa, v4 })
    }
    return "https://creativecommons.org/publicdomain/mark/1.0/"
}
export default getLicenseForFlags
const getLicenseForByFlags = ({ nc, sa, v4 }: Omit<LicenseFlags, "by">): ExtendedLicenseURL => {
    if (nc) {
        return getLicenseForByNcFlags({ sa, v4 })
    }
    if (sa) {
        return v4
            ? "https://creativecommons.org/licenses/by-sa/4.0/"
            : "https://creativecommons.org/licenses/by-sa/3.0/"
    }
    return v4 ? "https://creativecommons.org/licenses/by/4.0/" : "https://creativecommons.org/licenses/by/3.0/"
}
const getLicenseForByNcFlags = ({ sa, v4 }: Omit<LicenseFlags, "by" | "nc">): ExtendedLicenseURL => {
    if (sa) {
        return v4
            ? "https://creativecommons.org/licenses/by-nc-sa/4.0/"
            : "https://creativecommons.org/licenses/by-nc-sa/3.0/"
    }
    return v4 ? "https://creativecommons.org/licenses/by-nc/4.0/" : "https://creativecommons.org/licenses/by-nc/3.0/"
}
