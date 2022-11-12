import { Image } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import useModifiedPatcher from "~/swr/useModifiedPatcher"
import LicenseURLEditor from "../LicenseURLEditor"
export type Props = {
    uuid: UUID
}
const LicenseEditor: FC<Props> = ({ uuid }) => {
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const { data } = response
    const patcher = useModifiedPatcher(key, response)
    if (!data) {
        return null
    }
    return (
        <LicenseURLEditor
            onChange={value => {
                if (value) {
                    patcher({ license: value })
                }
            }}
            value={data.license}
        />
    )
}
export default LicenseEditor
