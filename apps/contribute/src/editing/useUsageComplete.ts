import { isPublicDomainLicenseURL, UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useImageSWR from "~/s3/swr/useImageSWR"
import useAttribution from "./useAttribution"
import useLicense from "./useLicense"
const useUsageComplete = (uuid: UUID) => {
    const { data: image } = useImageSWR(uuid)
    const attribution = useAttribution(uuid)
    const license = useLicense(uuid)
    const hasError = Boolean(attribution.error ?? license.error)
    const isValidating = attribution.isValidating || license.isValidating
    return useMemo(() => {
        if (image) {
            return true
        }
        if (license.data) {
            if (attribution.data) {
                return true
            }
            if (attribution.data === null && isPublicDomainLicenseURL(license.data)) {
                return true
            }
        }
        if (hasError || ((!attribution.data || !license.data) && isValidating)) {
            return undefined
        }
        return false
    }, [attribution.data, hasError, image, isValidating, license.data])
}
export default useUsageComplete
