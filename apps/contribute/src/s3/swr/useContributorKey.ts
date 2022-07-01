import { isUUID, UUID } from "@phylopic/utils"
import { useMemo } from "react"
const useContributorKey = (uuid: UUID | null) => {
    return useMemo(() => (isUUID(uuid) ? `/api/s3/source/contributors/${encodeURIComponent(uuid)}` : null), [uuid])
}
export default useContributorKey
