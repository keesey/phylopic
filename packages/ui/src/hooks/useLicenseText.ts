import { ExtendedLicenseURL, LICENSE_NAMES, SHORT_LICENSE_NAMES } from "@phylopic/utils"
import { useMemo } from "react"
export const useLicenseText = (licenseURL: ExtendedLicenseURL | undefined, short = false) => {
    return useMemo(
        () => (licenseURL ? (short ? SHORT_LICENSE_NAMES[licenseURL] : LICENSE_NAMES[licenseURL]) ?? null : null),
        [licenseURL, short],
    )
}
export default useLicenseText
