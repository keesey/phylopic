import { Submission } from "@phylopic/source-models"
import { Hash } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import TextEditor from "~/editors/TextEditor"
import fetchJSON from "~/fetch/fetchJSON"
import usePatcher from "~/swr/usePatcher"
export type Props = {
    hash: Hash
}
const SponsorEditor: FC<Props> = ({ hash }) => {
    const key = `/api/submissions/_/${encodeURIComponent(hash)}`
    const response = useSWR<Submission>(key, fetchJSON)
    const { data } = response
    const patcher = usePatcher(key, response)
    if (!data) {
        return null
    }
    return (
        <TextEditor
            emptyLabel="[None]"
            onChange={value => patcher({ sponsor: value })}
            optional
            value={data?.sponsor}
        />
    )
}
export default SponsorEditor
