import { isPublicDomainLicenseURL, UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useImageSWR from "../useImageSWR"
const useUsageComplete = (uuid: UUID | undefined) => {
    const { data } = useImageSWR(uuid)
    return useMemo(() => {
        if (data?.license) {
            return data.attribution !== null || isPublicDomainLicenseURL(data.license)
        }
        return !data ? undefined : false
    }, [data?.attribution, data?.license])
}
export default useUsageComplete
