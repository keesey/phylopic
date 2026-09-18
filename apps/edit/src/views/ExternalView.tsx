import type { External } from "@phylopic/source-models"
import { AuthorizedNamespaceView } from "@phylopic/ui"
import { type Authority, getAuthorizedNamespace, getIdentifier, type Namespace, type ObjectID } from "@phylopic/utils"
import Link from "next/link"
import { parseNomen } from "parse-nomen"
import { type FC, useMemo } from "react"
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
            <Link href={`/externals/${identifier}`}>
                <NameView name={name} />
            </Link>{" "}
            (<AuthorizedNamespaceView value={namespace} short />)
        </span>
    )
}
export default ExternalView
