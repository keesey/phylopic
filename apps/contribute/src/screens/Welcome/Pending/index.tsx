import { AnchorLink, Loader, NumberView } from "@phylopic/ui"
import { FC } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import UUIDPaginationContainer from "~/s3/pagination/UUIDPaginationContainer"
import Banner from "~/ui/Banner"
import SubmissionFileThumbnailView from "~/ui/SubmissionFileThumbnailView"
import SpawnLink from "~/ui/SpawnLink"
const Pending: FC = () => {
    const contributorUUID = useContributorUUID()
    if (!contributorUUID) {
        return null
    }
    return (
        <UUIDPaginationContainer endpoint="/api/submissions">
            {(uuids, isValidating) => (
                <>
                    <p>
                        {uuids.length > 0 && (
                            <>
                                You have <NumberView value={uuids.length} /> pending submission
                                {uuids.length === 1 ? "" : "s"}.{" "}
                                {uuids.length === 1
                                    ? "Click on it to edit it."
                                    : `Click on ${uuids.length === 2 ? "either" : "any"} to edit them.`}
                            </>
                        )}
                        {uuids.length === 0 && isValidating && "Looking for pending submissions…"}
                        {uuids.length === 0 && !isValidating && (
                            <>
                                You have no pending submissions. <SpawnLink>Upload a silhouette.</SpawnLink>
                            </>
                        )}
                    </p>
                    <Banner>
                        {uuids.length === 0 && isValidating && <Loader />}
                        {uuids.map(uuid => (
                            <AnchorLink key={uuid} href={`/edit/${encodeURIComponent(uuid)}`}>
                                <SubmissionFileThumbnailView uuid={uuid} />
                            </AnchorLink>
                        ))}
                    </Banner>
                </>
            )}
        </UUIDPaginationContainer>
    )
}
export default Pending
