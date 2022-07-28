import { AnchorLink } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import useRatioComplete from "~/editing/useRatioComplete"
import FileThumbnailView from "~/ui/FileThumbnailView"
import styles from "./index.module.scss"
export type Props = {
    uuid: UUID
}
const Item: FC<Props> = ({ uuid }) => {
    const contributorUUID = useContributorUUID()
    const ratioComplete = useRatioComplete(uuid)
    if (!contributorUUID) {
        return null
    }
    return (
        <AnchorLink className={styles.main} key={uuid} href={`/edit/${encodeURIComponent(uuid)}`}>
            <figure>
                <FileThumbnailView
                    src={`/api/submissions/${encodeURIComponent(uuid)}/source/${encodeURIComponent(contributorUUID)}`}
                />
                <figcaption>
                    <progress value={ratioComplete} max={1} />
                </figcaption>
            </figure>
        </AnchorLink>
    )
}
export default Item
