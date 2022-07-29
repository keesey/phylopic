import { UUID } from "@phylopic/utils"
import { FC } from "react"
import FileThumbnailView from "../FileThumbnailView"
export interface Props {
    uuid: UUID
}
const SourceFileThumbnailView: FC<Props> = ({ uuid }) => {
    return <FileThumbnailView src={`/api/images/${encodeURIComponent(uuid)}/source`} />
}
export default SourceFileThumbnailView
