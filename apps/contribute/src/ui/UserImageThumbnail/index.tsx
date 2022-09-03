/* eslint-disable @next/next/no-img-element */
import { ImageWithEmbedded } from "@phylopic/api-models"
import { ImageThumbnailView } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import clsx from "clsx"
import { FC } from "react"
import useSWRImmutable from "swr/immutable"
import useImage from "~/editing/useImage"
import NameRenderer from "~/screens/Assignment/NodeForm/NameRenderer"
import FileThumbnailView from "../FileThumbnailView"
import NameView from "../NameView"
import styles from "./index.module.scss"
export type Props = {
    uuid: UUID
}
const UserImageThumbnail: FC<Props> = ({ uuid }) => {
    const apiFetcher = useAPIFetcher<ImageWithEmbedded>()
    const publishedSWR = useSWRImmutable(
        `https://${process.env.NEXT_PUBLIC_API_DOMAIN}/images/${encodeURIComponent(uuid)}?embed_specificNode=true`,
        apiFetcher,
    )
    if (publishedSWR.error) {
        return <Unpublished uuid={uuid} />
    }
    if (publishedSWR.data) {
        return (
            <a
                className={styles.link}
                href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/images/${encodeURIComponent(uuid)}`}
                target="_blank"
                rel="noreferrer"
            >
                <figure className={clsx(styles.main, styles.published)}>
                    <ImageThumbnailView value={publishedSWR.data} />
                    <figcaption className={styles.caption}>
                        <NameView value={publishedSWR.data._embedded.specificNode?.names[0]} short />
                    </figcaption>
                </figure>
            </a>
        )
    }
    return null
}
export default UserImageThumbnail
const Unpublished: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    return (
        <figure className={clsx(styles.main, styles.unpublished)}>
            <FileThumbnailView src={`https://${process.env.NEXT_PUBLIC_SOURCE_IMAGES_DOMAIN}/images/${uuid}/source`} />
            <figcaption className={styles.caption}>
                {image?.specific ? <NameRenderer value={image?.specific} /> : null}
            </figcaption>
        </figure>
    )
}
