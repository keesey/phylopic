import type { ExtendedLicenseURL } from "@phylopic/utils"
import { getLicenseFlags, type ImageWithLicenseLink } from "./licenseFlags.js"

/** Mirrors www CollectionLicense/getLicenseForFlags. */
export const combinedLicenseUrl = (images: readonly ImageWithLicenseLink[]): ExtendedLicenseURL => {
    return getLicenseForFlags(getLicenseFlags(images))
}

const getLicenseForFlags = ({ by, nc, sa, v4 }: ReturnType<typeof getLicenseFlags>): ExtendedLicenseURL => {
    if (by) {
        return getLicenseForByFlags({ nc, sa, v4 })
    }
    return "https://creativecommons.org/publicdomain/mark/1.0/"
}

const getLicenseForByFlags = ({ nc, sa, v4 }: Omit<ReturnType<typeof getLicenseFlags>, "by">): ExtendedLicenseURL => {
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

const getLicenseForByNcFlags = ({ sa, v4 }: Omit<ReturnType<typeof getLicenseFlags>, "by" | "nc">): ExtendedLicenseURL => {
    if (sa) {
        return v4
            ? "https://creativecommons.org/licenses/by-nc-sa/4.0/"
            : "https://creativecommons.org/licenses/by-nc-sa/3.0/"
    }
    return v4 ? "https://creativecommons.org/licenses/by-nc/4.0/" : "https://creativecommons.org/licenses/by-nc/3.0/"
}
