import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import FullScreen from "~/pages/screenTypes/FullScreen"
import UUIDPaginationContainer from "~/s3/pagination/UUIDPaginationContainer"
import ImageGrid from "~/ui/ImageGrid"
const Images: FC = () => {
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
                        <ImageGrid
                            entries={uuids.map(uuid => ({
                                href: `/edit/${encodeURIComponent(uuid)}`,
                                src: `/api/s3/source/images/${encodeURIComponent(uuid)}/source`,
                                uuid,
                            }))}
                        />
                    </>
                )}
            </UUIDPaginationContainer>
        </FullScreen>
    )
}
export default Images
