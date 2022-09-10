import { Image } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import TextEditor from "~/editors/TextEditor"
import useModifiedPatcher from "~/swr/useModifiedPatcher"
export type Props = {
    uuid: UUID
}
const AttributionEditor: FC<Props> = ({ uuid }) => {
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const { data } = response
    const patcher = useModifiedPatcher(key, response)
    if (!data) {
        return null
    }
    return (
        <TextEditor
            emptyLabel="[Anonymous]"
            onChange={value => patcher({ attribution: value })}
            optional
            value={data?.attribution}
        />
    )
}
export default AttributionEditor
