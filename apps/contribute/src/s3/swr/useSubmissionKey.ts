import { isUUID, UUID } from "@phylopic/utils"
import { useMemo } from "react"
const useSubmissionKey = (uuid: UUID | null) => {
    return useMemo(() => (isUUID(uuid) ? `/api/submissions/${encodeURIComponent(uuid)}/meta.json` : null), [uuid])
}
export default useSubmissionKey
