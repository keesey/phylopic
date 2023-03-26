import { NodeWithEmbedded } from "@phylopic/api-models"
import { FC, Key, useCallback, useMemo, useState } from "react"
import NodeDetailsView from "~/views/NodeDetailsView"
import NomenView from "~/views/NomenView"
import HeaderNav, { Props as HeaderNavProps } from "../HeaderNav"
import { Props as HeaderNavButtonProps } from "../HeaderNav/HeaderNavButton"
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
    const handleDetailsButtonClick = useCallback(() => setDetailsActive(!detailsActive), [detailsActive])
    const buttons = useMemo<HeaderNavProps["buttons"]>(() => {
        const buttons: Array<HeaderNavButtonProps & { key: Key }> = []
        if (hasDetails) {
            buttons.push({
                children: detailsActive ? "Collapse Details ↑" : "See Details ↓",
                key: "details",
                onClick: handleDetailsButtonClick,
                type: "button",
            })
        }
        if (value && hasParent) {
            buttons.push({
                children: "View Lineage →",
                href: `/nodes/${value.uuid}/lineage`,
                key: "lineage",
                type: "anchor",
            })
        }
        return buttons
    }, [detailsActive, handleDetailsButtonClick, hasDetails, hasParent, value])
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
