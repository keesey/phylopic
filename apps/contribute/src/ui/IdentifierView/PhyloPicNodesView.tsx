import { Node } from "@phylopic/api-models"
import { useAPIFetcher } from "@phylopic/client-components"
import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWRImmutable from "swr/immutable"
import NameView from "../NameView"
export type Props = {
    short?: boolean
    uuid: UUID
}
const PhyloPicNodesView: FC<Props> = ({ short, uuid }) => {
    const apiFetcher = useAPIFetcher<Node>()
    const { data } = useSWRImmutable(`${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(uuid)}`, apiFetcher)
    if (!data) {
        return <>{INCOMPLETE_STRING}</>
    }
    return <NameView value={data.names[0]} short={short} />
}
export default PhyloPicNodesView
