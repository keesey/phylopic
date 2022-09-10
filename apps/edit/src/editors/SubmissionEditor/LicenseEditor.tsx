import { Submission } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Hash } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import usePatcher from "~/swr/usePatcher"
import ValidLicenseURLEditor from "../ValidLicenseURLEditor"
export type Props = {
    hash: Hash
}
const LicenseEditor: FC<Props> = ({ hash }) => {
    const key = `/api/submissions/_/${encodeURIComponent(hash)}`
    const response = useSWR<Submission>(key, fetchJSON)
    const { data } = response
    const patcher = usePatcher(key, response)
    if (!data) {
        return null
    }
    return <ValidLicenseURLEditor onChange={value => patcher({ license: value })} value={data.license} />
}
export default LicenseEditor
