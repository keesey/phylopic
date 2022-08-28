import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import TextEditor from "~/editors/TextEditor"
import fetchJSON from "~/fetch/fetchJSON"
import usePatcher from "~/swr/usePatcher"
export type Props = {
    uuid: UUID
}
const AttributionEditor: FC<Props> = ({ uuid }) => {
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const { data } = response
    const patcher = usePatcher(key, response)
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
