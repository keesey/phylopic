import { isPublicDomainLicenseURL, UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useAttribution from "./useAttribution"
import useLicense from "./useLicense"
const useLicenseComplete = (uuid: UUID) => {
    const attribution = useAttribution(uuid)
    const license = useLicense(uuid)
    const hasError = Boolean(attribution.error ?? license.error)
    const isValidating = attribution.isValidating || license.isValidating
    return useMemo(() => {
        if (license.data) {
            if (attribution.data) {
                return true
            }
            if (attribution.data === null && isPublicDomainLicenseURL(license.data)) {
                return true
            }
        }
        if (hasError || isValidating) {
            return undefined
        }
        return false
    }, [attribution.data, hasError, isValidating, license.data])
}
export default useLicenseComplete
