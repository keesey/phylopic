import { getIdentifierParts, Identifier, isIdentifier, isPositiveInteger, isString, isUUIDv4 } from "@phylopic/utils"
import { FC, useMemo } from "react"
import OTOLTaxonomyView from "./OTOLTaxonomyView"
import PhyloPicNodesView from "./PhyloPicNodesView"
export type Props = {
    value: Identifier
}
const IdentifierView: FC<Props> = ({ value }) => {
    const [authority, namespace, objectID] = useMemo(
        () => (isIdentifier(value) ? getIdentifierParts(value) : []),
        [value],
    )
    switch (authority) {
        case undefined: {
            return null
        }
        case "opentreeoflife.org": {
            if (namespace === "taxonomy" && isString(objectID)) {
                const id = parseInt(objectID, 10)
                if (isPositiveInteger(id)) {
                    return <OTOLTaxonomyView id={id} />
                }
            }
            break
        }
        case "phylopic.org": {
            if (namespace === "nodes" && isUUIDv4(objectID)) {
                return <PhyloPicNodesView uuid={objectID} />
            }
            break
        }
    }
    return <code>{value}</code>
}
export default IdentifierView
