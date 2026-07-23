import { NodeWithEmbedded } from "@phylopic/api-models"
import { FC, Key, useMemo, useState } from "react"
import customEvents from "~/analytics/customEvents"
import NodeDetailsView from "~/views/NodeDetailsView"
import NomenView from "~/views/NomenView"
import HeaderNav, { Props as HeaderNavProps } from "../HeaderNav"
import { Props as HeaderNavButtonProps } from "../HeaderNav/HeaderNavButton"
import getNodeHRef from "~/routes/getNodeHRef"
export type Props = {
    value?: NodeWithEmbedded
}
const NomenHeader: FC<Props> = ({ value }) => {
    const [detailsActive, setDetailsActive] = useState(false)
    const hasDetails = useMemo(() => {
        if (!value) {
            return false
        }
        const hasNames = value.names.length > 1
        const hasChildNodes = value._embedded?.childNodes && value._embedded.childNodes.length > 0
        const hasExternal = value._links.external.length > 0
        return hasNames || hasChildNodes || hasExternal
    }, [value])
    const hasParent = useMemo(() => Boolean(value?._links.parentNode), [value])
    const buttons = useMemo<HeaderNavProps["buttons"]>(() => {
        const buttons: Array<HeaderNavButtonProps & { key: Key }> = []
        if (hasDetails) {
            buttons.push({
                children: detailsActive ? "Collapse Details ↑" : "See Details ↓",
                key: "details",
                onClick: () => {
                    if (value) {
                        customEvents.toggleNodeDetails(!detailsActive, value)
                    }
                    setDetailsActive(!detailsActive)
                },
                type: "button",
            })
        }
        if (value && hasParent) {
            const href = getNodeHRef(value._links.self) + "/lineage"
            buttons.push({
                children: "View Lineage →",
                href,
                key: "lineage",
                onClick: () => customEvents.clickLink("view_lineage", href, "View Lineage →", "button"),
                type: "anchor",
            })
        }
        return buttons
    }, [detailsActive, hasDetails, hasParent, value])
    return (
        <>
            <HeaderNav
                buttons={buttons}
                header={<NomenView value={value?.names[0]} short defaultText="[Unnamed]" />}
                headerLevel={1}
            />
            {hasDetails && <NodeDetailsView active={detailsActive} value={value} />}
        </>
    )
}
export default NomenHeader
