import { Image } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import useModifiedPatcher from "~/swr/useModifiedPatcher"
export type Props = {
    uuid: UUID
}
const ListedEditor: FC<Props> = ({ uuid }) => {
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const { data } = response
    const patcher = useModifiedPatcher(key, response)
    if (!data) {
        return null
    }
    return (
        <input
            type="checkbox"
            checked={!data.unlisted}
            onChange={() => {
                if (data.unlisted) {
                    if (confirm("Are you sure you want to restore this image?")) {
                        patcher({ unlisted: false })
                    }
                } else if (confirm("Are you sure you want to remove this image from the public listing?")) {
                    patcher({ unlisted: true })
                }
            }}
        />
    )
}
export default ListedEditor
