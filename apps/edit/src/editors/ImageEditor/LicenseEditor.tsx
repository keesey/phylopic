import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import usePatcher from "~/swr/usePatcher"
import LicenseURLEditor from "../LicenseURLEditor"
export type Props = {
    uuid: UUID
}
const LicenseEditor: FC<Props> = ({ uuid }) => {
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const { data } = response
    const patcher = usePatcher(key, response)
    if (!data) {
        return null
    }
    return <LicenseURLEditor onChange={value => patcher({ license: value })} value={data.license} />
}
export default LicenseEditor
