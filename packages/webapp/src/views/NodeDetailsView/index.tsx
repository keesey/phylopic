import { NodeWithEmbedded } from "@phylopic/api-models"
import React, { useState, FC } from "react"
import AnchorLink from "~/ui/AnchorLink"
import InlineSections from "~/ui/InlineSections"
import NomenListView from "~/views/NomenListView"
import NodeExternalView from "~/views/NodeExternalView"
import NodeListView from "~/views/NodeListView"
import NomenView from "../NomenView"
import styles from "./index.module.scss"
export interface Props {
    value?: NodeWithEmbedded
}
const NodeDetailsView: FC<Props> = ({ value }) => {
    const [active, setActive] = useState(false)
    if (!value) {
        return null
    }
    const hasNames = value.names.length > 1
    const hasChildNodes = value._embedded?.childNodes && value._embedded.childNodes.length > 0
    const hasExternal = value._links.external.length > 0
    const hasParent = Boolean(value._links.parentNode)
    if (!hasNames && !hasChildNodes && !hasExternal && !hasParent) {
        return null
    }
    if (!active) {
        return (
            <div key="controls" className={styles.controls}>
                {(hasNames || hasChildNodes || hasExternal) && (
                    <button key="details" className={styles.button} onClick={() => setActive(true)}>
                        See Details ⌄
                    </button>
                )}
                {hasParent && (
                    <AnchorLink key="lineage" href={`/nodes/${value.uuid}/lineage`}>
                        View Lineage
                    </AnchorLink>
                )}
            </div>
        )
    }
    return (
        <section>
            <h2>
                Details about <NomenView value={value.names[0]} />
            </h2>
            <InlineSections key="info">
                {hasNames && (
                    <section key="names">
                        <h3>Synonym{value.names.length > 2 ? "s" : ""}</h3>
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
            <br />
            <div key="controls" className={styles.controls}>
                <button key="details" className={styles.button} onClick={() => setActive(false)}>
                    Collapse Details ⌃
                </button>
                {hasParent && (
                    <AnchorLink key="lineage" href={`/nodes/${value.uuid}/lineage`}>
                        View Lineage
                    </AnchorLink>
                )}
            </div>
        </section>
    )
}
export default NodeDetailsView
