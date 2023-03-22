import { ImageWithEmbedded } from "@phylopic/api-models"
import { Node } from "@phylopic/source-models"
import { ImageThumbnailView } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import clsx from "clsx"
import Link from "next/link"
import { FC } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import useImage from "~/editing/useImage"
import FileThumbnailView from "../FileThumbnailView"
import NameView from "../NameView"
import styles from "./index.module.scss"
export type Props = {
    uuid: UUID
}
const UserImageThumbnail: FC<Props> = ({ uuid }) => {
    const apiFetcher = useAPIFetcher<ImageWithEmbedded>()
    const publishedSWR = useSWRImmutable(
        `${process.env.NEXT_PUBLIC_API_URL}/images/${encodeURIComponent(uuid)}?embed_specificNode=true`,
        apiFetcher,
    )
    if (publishedSWR.error) {
        return <Unpublished uuid={uuid} />
    }
    if (publishedSWR.data) {
        return (
            <Link className={styles.link} href={`/images/${encodeURIComponent(uuid)}`}>
                <figure className={clsx(styles.main, styles.published)}>
                    <ImageThumbnailView value={publishedSWR.data} />
                    <figcaption className={styles.caption}>
                        <NameView value={publishedSWR.data._embedded.specificNode?.names[0]} short />
                    </figcaption>
                </figure>
            </Link>
        )
    }
    return null
}
export default UserImageThumbnail
const Unpublished: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const fetcher = useAuthorizedJSONFetcher<Node & { uuid: UUID }>()
    const { data: specific } = useSWRImmutable<Node & { uuid: UUID }>(
        image?.specific ? `/api/nodes/${encodeURIComponent(image?.specific)}` : null,
        fetcher,
    )
    return (
        <figure className={clsx(styles.main, styles.unpublished)}>
            <FileThumbnailView src={`/api/images/${encodeURIComponent(uuid)}/file`} small />
            <figcaption className={styles.caption}>
                {specific ? <NameView value={specific.names[0]} short /> : null}
            </figcaption>
        </figure>
    )
}
