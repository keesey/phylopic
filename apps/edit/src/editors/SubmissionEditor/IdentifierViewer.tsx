import { Submission } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Hash } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import NameRenderer from "~/views/NameRenderer"
export type Props = {
    hash: Hash
}
const IdentifierViewer: FC<Props> = ({ hash }) => {
    const { data } = useSWR<Submission>(`/api/submissions/_/${encodeURIComponent(hash)}`, fetchJSON)
    if (!data) {
        return null
    }
    if (!data.identifier) {
        return <>[Unassigned]</>
    }
    if (data.newTaxonName) {
        return (
            <div>
                <NameRenderer value={data.newTaxonName} />
                {/* :TODO: link */} (<code>{data.identifier}</code>)
            </div>
        )
    }
    return (
        <div>
            {/* :TODO: link */}
            <code>{data.identifier}</code>
        </div>
    )
}
export default IdentifierViewer
