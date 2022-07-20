import { AnchorLink, Loader, NumberView } from "@phylopic/ui"
import { FC } from "react"
import UUIDPaginationContainer from "~/s3/pagination/UUIDPaginationContainer"
import Banner from "~/ui/Banner"
import FileThumbnailView from "~/ui/FileThumbnailView"
const MAX_ITEMS = 24
const Accepted: FC = () => {
    return (
        <UUIDPaginationContainer endpoint="/api/s3/source/images" maxItems={MAX_ITEMS}>
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
                                {uuids.length === 1 ? "" : "s"}. Click on any to edit them.
                            </>
                        )}
                        {uuids.length === 0 && isValidating && "Looking for accepted images…"}
                        {uuids.length === 0 && !isValidating && "You have no accepted images … yet."}
                    </p>
                    <Banner>
                        {uuids.length === 0 && isValidating && <Loader />}
                        {uuids.map(uuid => (
                            <AnchorLink key={uuid} href={`/images/${encodeURIComponent(uuid)}`}>
                                <FileThumbnailView src={`/api/s3/source/images/${encodeURIComponent(uuid)}/source`} />
                            </AnchorLink>
                        ))}
                    </Banner>
                </>
            )}
        </UUIDPaginationContainer>
    )
}
export default Accepted
