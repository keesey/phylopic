import { getLicenseFlags, type ImageWithLicenseLink, type LicenseFlags } from "@phylopic/api-models"
import type { ExtendedLicenseURL } from "@phylopic/utils"

/** Mirrors www CollectionLicense/getLicenseForFlags. */
export const combinedLicenseUrl = (images: readonly ImageWithLicenseLink[]): ExtendedLicenseURL => {
    return getLicenseForFlags(getLicenseFlags(images))
}

const getLicenseForFlags = ({ by, nc, sa, v4 }: LicenseFlags): ExtendedLicenseURL => {
    if (by) {
        return getLicenseForByFlags({ nc, sa, v4 })
    }
    return "https://creativecommons.org/publicdomain/mark/1.0/"
}

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
