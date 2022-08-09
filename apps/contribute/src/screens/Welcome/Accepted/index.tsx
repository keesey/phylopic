import { AnchorLink, Loader, NumberView } from "@phylopic/ui"
import { FC } from "react"
import UUIDPaginationContainer from "~/s3/pagination/UUIDPaginationContainer"
import Banner from "~/ui/Banner"
import SourceFileThumbnailView from "~/ui/SourceFileThumbnailView copy"
const MAX_ITEMS = 24
const Accepted: FC = () => {
    return (
        <UUIDPaginationContainer endpoint="/api/images" maxItems={MAX_ITEMS}>
            {(uuids, isValidating) => (
                <>
                    <p>
                        {uuids.length >= MAX_ITEMS && (
                            <>
                                These are some of your accepted images.{" "}
                                <AnchorLink href="/images" className="text">
                                    See them all.
                                </AnchorLink>
                            </>
                        )}
                        {uuids.length > 0 && uuids.length < MAX_ITEMS && (
                            <>
                                You have <NumberView value={uuids.length} /> accepted image
                                {uuids.length === 1 ? "" : "s"}. Click on{" "}
                                {uuids.length === 1 ? "it" : uuids.length === 2 ? "either" : "any"} to edit{" "}
                                {uuids.length === 1 ? "it" : "them"}.
                            </>
                        )}
                        {uuids.length === 0 && isValidating && "Looking for accepted images…"}
                        {uuids.length === 0 && !isValidating && "You have no accepted images … yet."}
                    </p>
                    <Banner>
                        {uuids.length === 0 && isValidating && <Loader />}
                        {uuids.map(uuid => (
                            <AnchorLink key={uuid} href={`/edit/${encodeURIComponent(uuid)}`}>
                                <SourceFileThumbnailView uuid={uuid} />
                            </AnchorLink>
                        ))}
                    </Banner>
                </>
            )}
        </UUIDPaginationContainer>
    )
}
export default Accepted
