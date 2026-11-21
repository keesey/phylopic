import { getCombinedLicenseUrl, type Image } from "@phylopic/api-models"
import type { ExtendedLicenseURL } from "@phylopic/utils"
import { useMemo } from "react"

const useCollectionLicense = (images: readonly Image[]): ExtendedLicenseURL => {
    return useMemo(() => {
        return getCombinedLicenseUrl(images)
    }, [images])
}

export default useCollectionLicense
