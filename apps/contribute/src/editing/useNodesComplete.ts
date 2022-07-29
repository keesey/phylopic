import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useImageSWR from "~/s3/swr/useImageSWR"
import useGeneral from "./useGeneral"
import useSpecific from "./useSpecific"
const useNodesComplete = (uuid: UUID) => {
    const { data: image } = useImageSWR(uuid)
    const general = useGeneral(uuid)
    const specific = useSpecific(uuid)
    const hasError = Boolean(specific.error ?? general.error)
    const isValidating = specific.isValidating || general.isValidating
    const hasGeneral = general.data !== undefined
    const hasSpecific = Boolean(specific.data)
    return useMemo(() => {
        if (image) {
            return true
        }
        if (hasGeneral && hasSpecific) {
            return true
        }
        if (hasError || isValidating) {
            return undefined
        }
        return false
    }, [hasGeneral, hasError, hasSpecific, image, isValidating])
}
export default useNodesComplete
