import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import NameView from "~/views/NameView"
import NamesEditor from "./NamesEditor"
export type Props = { uuid: UUID }
const NodeEditor: FC<Props> = ({ uuid }) => {
    const { data: node } = useSWR<Node & { uuid: UUID }>(`/api/nodes/_/${uuid}`, fetchJSON)
    const { data: parent } = useSWR<Node & { uuid: UUID }>(node ? `/api/nodes/_/${node.parent}` : null, fetchJSON)
    return (
        <section>
            <dl>
                <dt>Parent</dt>
                <dd>{parent ? <NameView name={parent.names[0]} /> : "N/A"}</dd>
                <dt>Names</dt>
                <dd>
                    <NamesEditor uuid={uuid} />
                </dd>
            </dl>
        </section>
    )
}
export default NodeEditor
