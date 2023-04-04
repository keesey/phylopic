import { Image } from "@phylopic/api-models"
import { ExtendedLicenseURL } from "@phylopic/utils"
import { useMemo } from "react"
import getLicenseFlags from "./getLicenseFlags"
import getLicenseForFlags from "./getLicenseForFlags"
const useCollectionLicense = (images: readonly Image[]): ExtendedLicenseURL => {
    return useMemo(() => {
        return getLicenseForFlags(getLicenseFlags(images))
    }, [images])
}
export default useCollectionLicense
