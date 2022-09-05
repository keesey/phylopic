import { Node } from "@phylopic/api-models"
import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { FC } from "react"
import useSWRImmutable from "swr/immutable"
import NameView from "../NameView"
export type Props = {
    short?: boolean
    uuid: UUID
}
const PhyloPicNodesView: FC<Props> = ({ short, uuid }) => {
    const apiFetcher = useAPIFetcher<Node>()
    const { data } = useSWRImmutable(
        `https://${process.env.NEXT_PUBLIC_API_DOMAIN}/nodes/${encodeURIComponent(uuid)}`,
        apiFetcher,
    )
    if (!data) {
        return <>{INCOMPLETE_STRING}</>
    }
    return <NameView name={data.names[0]} short={short} />
}
export default PhyloPicNodesView
