import { ImageListParameters } from "@phylopic/api-models"
import { AnchorLink, Loader } from "@phylopic/ui"
import { Query } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import FullScreen from "~/pages/screenTypes/FullScreen"
import UUIDPaginationContainer from "~/s3/pagination/UUIDPaginationContainer"
import FileThumbnailView from "~/ui/FileThumbnailView"
import styles from "./index.module.scss"
const Images: FC = () => {
    const uuid = useContributorUUID()
    const query = useMemo<(ImageListParameters & Query) | undefined>(
        () => (uuid ? { embed_specificNode: "true", filter_contributor: uuid } : undefined),
        [uuid],
    )
    if (!query) {
        return <Loader />
    }
    return (
        <FullScreen>
            <UUIDPaginationContainer endpoint="/api/s3/source/images">
                {(uuids, isValidating) => (
                    <>
                        <p className="dialogue">
                            {uuids.length === 0 && isValidating && "Loading images…"}
                            {uuids.length === 0 && !isValidating && "None of your submissions have been accepted yet."}
                            {uuids.length === 1 && "One submission has been accepted. Click on it to edit it."}
                            {uuids.length > 1 && "These submissions have been accepted. Click on any to edit them."}
                        </p>
                        <p>
                            <AnchorLink href="/" className="text">
                                ← Return to Home Screen.
                            </AnchorLink>
                        </p>
                        <div className={styles.imageGrid}>
                            {uuids.map(uuid => (
                                <AnchorLink key={uuid} href={`/images/${encodeURIComponent(uuid)}`}>
                                    <FileThumbnailView
                                        src={`/api/s3/source/images/${encodeURIComponent(uuid)}/source`}
                                    />
                                </AnchorLink>
                            ))}
                        </div>
                    </>
                )}
            </UUIDPaginationContainer>
        </FullScreen>
    )
}
export default Images
