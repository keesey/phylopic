import { AnchorLink, Loader } from "@phylopic/ui"
import { FC } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import FullScreen from "~/pages/screenTypes/FullScreen"
import getSubmissionSourceKey from "~/s3/keys/submissions/getSubmissionSourceKey"
import UUIDPaginationContainer from "~/s3/pagination/UUIDPaginationContainer"
import ImageGrid from "~/ui/ImageGrid"
const Submissions: FC = () => {
    const contributorUUID = useContributorUUID()
    if (!contributorUUID) {
        return (
            <FullScreen>
                <Loader />
            </FullScreen>
        )
    }
    return (
        <FullScreen>
            <UUIDPaginationContainer endpoint={`/api/submissions`}>
                {(uuids, isValidating) => (
                    <>
                        <p className="dialogue">
                            {uuids.length === 0 && isValidating && "Loading submissions"}
                            {uuids.length === 0 && !isValidating && "You have not submitted any silhouette images yet."}
                            {uuids.length === 1 && "You have one pending submission. Click on it to edit it."}
                            {uuids.length > 1 && "These are your pending submissions. Click on any to edit them."}
                        </p>
                        <p>
                            <AnchorLink href="/" className="text">
                                ← Return to Home Screen.
                            </AnchorLink>
                        </p>
                        <ImageGrid
                            entries={uuids.map(uuid => ({
                                href: `/edit/${encodeURIComponent(uuid)}`,
                                src: `/api/${getSubmissionSourceKey(contributorUUID, uuid)}`,
                                uuid,
                            }))}
                        />
                    </>
                )}
            </UUIDPaginationContainer>
        </FullScreen>
    )
}
export default Submissions
