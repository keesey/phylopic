import { NodeWithEmbedded } from "@phylopic/api-models"
import React, { FC } from "react"
import InlineSections from "~/ui/InlineSections"
import NodeExternalView from "~/views/NodeExternalView"
import NodeListView from "~/views/NodeListView"
import NomenListView from "~/views/NomenListView"
import NomenView from "../NomenView"
export interface Props {
    value?: NodeWithEmbedded
}
const NodeDetailsView: FC<Props> = ({ value }) => {
    if (!value) {
        return null
    }
    const hasNames = value.names.length > 1
    const hasChildNodes = value._embedded?.childNodes && value._embedded.childNodes.length > 0
    const hasExternal = value._links.external.length > 0
    if (!hasNames && !hasChildNodes && !hasExternal) {
        return null
    }
    return (
        <section>
            <h2>
                Details about <NomenView value={value.names[0]} />
            </h2>
            <InlineSections key="info">
                {hasNames && (
                    <section key="names">
                        <h3>Equivalent Name{value.names.length > 2 ? "s" : ""}</h3>
                        <NomenListView value={value.names.slice(1)} />
                    </section>
                )}
                {hasChildNodes && (
                    <section key="childNodes">
                        <h3>Subgroup{value._embedded.childNodes?.length === 1 ? "" : "s"}</h3>
                        <NodeListView value={value._embedded.childNodes} short />
                    </section>
                )}
                {hasExternal && (
                    <section key="external">
                        <h3>External Source{value._links.external.length > 1 ? "s" : ""}</h3>
                        <NodeExternalView value={value._links.external} short />
                    </section>
                )}
            </InlineSections>
        </section>
    )
}
export default NodeDetailsView
