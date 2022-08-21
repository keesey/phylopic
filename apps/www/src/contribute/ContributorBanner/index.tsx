import { Image } from "@phylopic/api-models"
import { isJWT, JWT } from "@phylopic/source-models"
import { useStoredState } from "@phylopic/ui"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { decode } from "jsonwebtoken"
import { FC, useMemo, useState } from "react"
import styles from "./index.module.scss"
import useSWRImmutable from "swr/immutable"
import { useAPIFetcher } from "@phylopic/utils-api"
export type Props = {
    imageUUID: UUID
}
const ContributorBanner: FC<Props> = ({ imageUUID }) => {
    const [dismissed, setDismissed] = useState(false)
    const fetcher = useAPIFetcher<Image>()
    const { data: image } = useSWRImmutable(
        `${process.env.NEXT_PUBLIC_API_URL}/images/${encodeURIComponent(imageUUID)}`,
        fetcher,
    )
    const [token] = useStoredState<JWT>("auth")
    const decoded = useMemo(() => (isJWT(token) ? decode(token) : null), [token])
    const { sub } = decoded ?? {}
    const contributorUUID = useMemo<UUID | null>(() => (isUUIDv4(sub) ? sub : null), [sub])
    const imageContributorUUID = useMemo<UUID | null>(() => {
        if (image?._links.contributor) {
            const { href } = image._links.contributor
            const uuid = href.replace(/^\/contributors\//, "").replace(/\?.*$/, "")
            if (isUUIDv4(uuid)) {
                return uuid
            }
        }
        return null
    }, [image])
    if (dismissed || !imageContributorUUID || imageContributorUUID !== contributorUUID || !image?.uuid) {
        return null
    }
    return (
        <div className={styles.main}>
            <span>
                Hey, you uploaded this one!{" "}
                <a
                    className={styles.link}
                    href={`https://contribute.phylopic.org/edit/${encodeURIComponent(image?.uuid)}`}
                >
                    Want to have a look at it in the Image Contribution Tool?
                </a>
            </span>
            <a className={styles.closer} onClick={() => setDismissed(true)}>
                ×
            </a>
        </div>
    )
}
export default ContributorBanner
