import { isUUID, UUID } from "@phylopic/utils"
import { useMemo } from "react"
const useImageKey = (uuid: UUID | null) => {
    return useMemo(() => (isUUID(uuid) ? `/api/images/${encodeURIComponent(uuid)}` : null), [uuid])
}
export default useImageKey
