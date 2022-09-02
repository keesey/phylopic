import { getIdentifierParts, Identifier, isIdentifier, isUUIDv4 } from "@phylopic/utils"
import { FC, useMemo } from "react"
import ExternalView from "./ExternalView"
import PhyloPicNodesView from "./PhyloPicNodesView"
export type Props = {
    short?: boolean
    value: Identifier
}
const IdentifierView: FC<Props> = ({ short, value }) => {
    const [authority, namespace, objectID] = useMemo(
        () => (isIdentifier(value) ? getIdentifierParts(value) : []),
        [value],
    )
    if (!authority || !namespace || !objectID) {
        return <>[Unnamed]</>
    }
    if (authority === "phylopic.org" && namespace === "nodes" && isUUIDv4(objectID)) {
        return <PhyloPicNodesView uuid={objectID} short={short} />
    }
    return <ExternalView authority={authority} namespace={namespace} objectID={objectID} short={short} />
}
export default IdentifierView
