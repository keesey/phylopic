import { Image } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/utils-api"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import TextEditor from "~/editors/TextEditor"
import useModifiedPatcher from "~/swr/useModifiedPatcher"
export type Props = {
    uuid: UUID
}
const SponsorEditor: FC<Props> = ({ uuid }) => {
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const { data } = response
    const patcher = useModifiedPatcher(key, response)
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
