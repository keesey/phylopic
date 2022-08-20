import { ImageWithEmbedded, NodeWithEmbedded } from "@phylopic/api-models"
import { ImageThumbnailView } from "@phylopic/ui"
import { Authority, isUUIDv4, Namespace, ObjectID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { FC, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { SearchEntry } from "~/search/SearchEntry"
import AuthorityIcon from "./AuthorityIcon"
import styles from "./index.module.scss"
export type Props = {
    value: Pick<SearchEntry, "authority" | "namespace" | "objectID">
}
const useNodeImage = (authority: Authority, namespace: Namespace, objectID: ObjectID) => {
    const internal = useMemo(
        () => authority === "phylopic.org" && namespace === "nodes" && isUUIDv4(objectID),
        [authority, namespace, objectID],
    )
    const fetcher = useAPIFetcher<NodeWithEmbedded>()
    const key = internal
        ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(objectID)}?embed_primaryImage=true`
        : `${process.env.NEXT_PUBLIC_API_URL}/resolve/${encodeURIComponent(authority)}/${encodeURIComponent(
              namespace,
          )}/${encodeURIComponent(objectID)}?embed_primaryImage=true`
    const { data } = useSWRImmutable(key, fetcher)
    return data?._embedded.primaryImage as ImageWithEmbedded | null | undefined
}
const Icon: FC<Props> = ({ value }) => {
    const image = useNodeImage(value.authority, value.namespace, value.objectID)
    return (
        <span className={styles.main}>
            {image ? <ImageThumbnailView value={image} /> : <AuthorityIcon authority={value.authority} />}
        </span>
    )
}
export default Icon
