import { Node } from "@phylopic/api-models"
import { useAPIFetcher } from "@phylopic/client-components"
import { Authority, isPositiveInteger, Namespace, ObjectID } from "@phylopic/utils"
import { FC } from "react"
import useSWRImmutable from "swr/immutable"
import NameView from "~/views/NameView"
import GBIFSpeciesView from "./GBIFSpeciesView"
import OTOLTaxonomyView from "./OTOLTaxonomyView"
import PBDBTxnView from "./PBDBTxnView"
export type Props = {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
    short?: boolean
}
const ExternalView: FC<Props> = ({ authority, namespace, objectID, short }) => {
    const fetcher = useAPIFetcher<Node>()
    const { data: node } = useSWRImmutable(
        `${process.env.NEXT_PUBLIC_API_URL}/resolve/${encodeURIComponent(authority)}/${encodeURIComponent(
            namespace,
        )}/${encodeURIComponent(objectID)}`,
        fetcher,
    )
    if (node) {
        return <NameView name={node.names[0]} short={short} />
    }
    if (authority === "gbif.org" && namespace === "species") {
        const id = parseInt(objectID, 10)
        if (isPositiveInteger(id)) {
            return <GBIFSpeciesView id={id} />
        }
    }
    if (authority === "opentreeoflife.org" && namespace === "taxonomy") {
        const id = parseInt(objectID, 10)
        if (isPositiveInteger(id)) {
            return <OTOLTaxonomyView id={id} />
        }
    }
    if (authority === "paleobiodb.org" && namespace === "txn") {
        const oid = parseInt(objectID, 10)
        if (isPositiveInteger(oid)) {
            return <PBDBTxnView oid={oid} />
        }
    }
    return (
        <code>
            {authority} / {namespace} / {objectID}
        </code>
    )
}
export default ExternalView
