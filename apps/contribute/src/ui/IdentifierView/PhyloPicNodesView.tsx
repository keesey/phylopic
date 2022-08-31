import { Node } from "@phylopic/api-models"
import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { FC } from "react"
import useSWRImmutable from "swr/immutable"
import NameView from "../NameView"
export type Props = {
    uuid: UUID
}
const PhyloPicNodesView: FC<Props> = ({ uuid }) => {
    const apiFetcher = useAPIFetcher<Node>()
    const { data } = useSWRImmutable(
        `https://${process.env.NEXT_PUBLIC_API_DOMAIN}/nodes/${encodeURIComponent(uuid)}`,
        apiFetcher,
    )
    if (!data) {
        return <>{INCOMPLETE_STRING}</>
    }
    return <NameView value={data.names[0]} />
}
export default PhyloPicNodesView
