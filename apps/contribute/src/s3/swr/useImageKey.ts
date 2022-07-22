import { isUUID, UUID } from "@phylopic/utils"
import { useMemo } from "react"
const useImageKey = (uuid: UUID | null) => {
    return useMemo(() => (isUUID(uuid) ? `/api/s3/source/images/${encodeURIComponent(uuid)}/meta.json` : null), [uuid])
}
export default useImageKey
