import { AnchorLink, Loader, NumberView } from "@phylopic/ui"
import { FC, useMemo } from "react"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import getContributorSubmissionsKeyPrefix from "~/s3/keys/contribute/getContributorSubmissionsKeyPrefix"
import UUIDPaginationContainer from "~/s3/pagination/UUIDPaginationContainer"
import Banner from "~/ui/Banner"
import FileThumbnailView from "~/ui/FileThumbnailView"
import SpawnLink from "~/ui/SpawnLink"
const Pending: FC = () => {
    const emailAddress = useEmailAddress()
    const endpoint = useMemo(
        () => (emailAddress ? "/api/s3/contribute/" + getContributorSubmissionsKeyPrefix(emailAddress) : null),
        [emailAddress],
    )
    return (
        <UUIDPaginationContainer endpoint={endpoint}>
            {(uuids, isValidating) => (
                <>
                    <p>
                        {uuids.length > 0 && (
                            <>
                                You have <NumberView value={uuids.length} /> pending submission
                                {uuids.length === 1 ? "" : "s"}.{" "}
                                {uuids.length === 1 ? "Click on it to edit it." : "Click on any to edit them."}
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
                            <AnchorLink key={uuid} href={`/submissions/${encodeURIComponent(uuid)}`}>
                                <FileThumbnailView
                                    src={`/api/s3/contribute/submissionfiles/${encodeURIComponent(uuid)}`}
                                />
                            </AnchorLink>
                        ))}
                    </Banner>
                </>
            )}
        </UUIDPaginationContainer>
    )
}
export default Pending
