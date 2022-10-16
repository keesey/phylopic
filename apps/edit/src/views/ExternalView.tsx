import { External } from "@phylopic/source-models"
import { AnchorLink, AuthorizedNamespaceView } from "@phylopic/ui"
import { Authority, getAuthorizedNamespace, getIdentifier, Namespace, ObjectID } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import NameView from "./NameView"

export type Props = {
    external: External & { authority: Authority; namespace: Namespace; objectID: ObjectID }
}
const ExternalView: FC<Props> = ({ external }) => {
    const identifier = useMemo(
        () => getIdentifier(external.authority, external.namespace, external.objectID),
        [external.authority, external.namespace, external.objectID],
    )
    const name = useMemo(() => parseNomen(external.title), [external.title])
    const namespace = useMemo(
        () => getAuthorizedNamespace(external.authority, external.namespace),
        [external.authority, external.namespace],
    )
    return (
        <span>
            <AnchorLink href={`/externals/${identifier}`}>
                <NameView name={name} />
            </AnchorLink>{" "}
            (<AuthorizedNamespaceView value={namespace} short />)
        </span>
    )
}
export default ExternalView
