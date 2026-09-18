import type { Submission } from "@phylopic/source-models"
import type { Hash } from "@phylopic/utils"
import { fetchJSON } from "@phylopic/utils-api"
import type { FC } from "react"
import useSWR from "swr"
import TextEditor from "~/editors/TextEditor"
import usePatcher from "~/swr/usePatcher"
export type Props = {
    hash: Hash
}
const AttributionEditor: FC<Props> = ({ hash }) => {
    const key = `/api/submissions/_/${encodeURIComponent(hash)}`
    const response = useSWR<Submission>(key, fetchJSON)
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
