import { isJWT } from "@phylopic/source-models"
import { useNomenText } from "@phylopic/ui"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useImageNode from "~/editing/hooks/useImageNode"
import FileThumbnailView from "../FileThumbnailView"
export interface Props {
    uuid: UUID
}
const SubmissionFileThumbnailView: FC<Props> = ({ uuid }) => {
    const token = useAuthToken()
    const src = useMemo(
        () =>
            isUUIDv4(uuid) && isJWT(token)
                ? `/api/submissions/${encodeURIComponent(uuid)}/source?token=${encodeURIComponent(token)}`
                : undefined,
        [token, uuid],
    )
    const specific = useImageNode(uuid, "specific")
    const alt = useNomenText(specific?.names[0])
    return <FileThumbnailView src={src} alt={alt} />
}
export default SubmissionFileThumbnailView
