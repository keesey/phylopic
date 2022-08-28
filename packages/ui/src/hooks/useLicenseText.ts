import { LicenseURL, LICENSE_NAMES, SHORT_LICENSE_NAMES } from "@phylopic/utils"
import { useMemo } from "react"
export const useLicenseText = (licenseURL: LicenseURL, short = false) => {
    return useMemo(
        () => (short ? SHORT_LICENSE_NAMES[licenseURL] : LICENSE_NAMES[licenseURL]) ?? null,
        [licenseURL, short],
    )
}
export default useLicenseText
