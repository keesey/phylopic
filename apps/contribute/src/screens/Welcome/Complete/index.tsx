import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import ImagePaginator from "~/pagination/ImagePaginator"
import ImageGrid from "~/ui/ImageGrid"
import ImageThumbnailView from "~/ui/ImageThumbnailView"
import NumberAsWords from "~/ui/NumberAsWords"
import SpawnLink from "~/ui/SpawnLink"
const Complete: FC = () => {
    const accepted = useImageCount("accepted")
    const submitted = useImageCount("submitted")
    const withdrawn = useImageCount("withdrawn")
    const hasAccepted = typeof accepted === "number" && accepted > 0
    const hasSubmitted = typeof submitted === "number" && submitted > 0
    const hasWithdrawn = typeof withdrawn === "number" && withdrawn > 0
    const filter = hasSubmitted ? "submitted" : hasAccepted ? "accepted" : "withdrawn"
    return (
        <>
            {hasSubmitted && (
                <>
                    <p>
                        You have <NumberAsWords max={100} value={submitted} /> submission{submitted === 1 ? "" : "s"}{" "}
                        awaiting review. You may click on {submitted === 1 ? "it" : "any of them"} to make revisions
                        first, if you want. Or, <SpawnLink>upload a new one!</SpawnLink>
                    </p>
                    {(hasAccepted || hasWithdrawn) && (
                        <p>
                            You also have{" "}
                            {hasAccepted && (
                                <AnchorLink href="/images/accepted" className="text">
                                    <NumberAsWords max={100} value={accepted} /> accepted submission
                                    {accepted === 1 ? "" : "s"}
                                </AnchorLink>
                            )}
                            {hasAccepted && hasWithdrawn && " and "}
                            {hasWithdrawn && (
                                <AnchorLink href="/images/withdrawn" className="text">
                                    <NumberAsWords max={100} value={withdrawn} /> withdrawn submission
                                    {withdrawn === 1 ? "" : "s"}
                                </AnchorLink>
                            )}
                            .
                        </p>
                    )}
                </>
            )}
            {!hasSubmitted && hasAccepted && (
                <>
                    <p>
                        You have <NumberAsWords max={100} value={accepted} /> accepted submission
                        {accepted === 1 ? "" : "s"}. Click on {accepted === 1 ? "it" : "any of them"} to edit{" "}
                        {accepted === 1 ? "it" : "them"}, if you want. Or, <SpawnLink>upload a new one!</SpawnLink>
                    </p>
                    {hasWithdrawn && (
                        <p>
                            You also have{" "}
                            <AnchorLink href="/images/withdrawn">
                                <NumberAsWords max={100} value={withdrawn} /> withdrawn submission
                                {withdrawn === 1 ? "" : "s"}
                            </AnchorLink>
                            .
                        </p>
                    )}
                </>
            )}
            {!hasSubmitted && !hasAccepted && hasWithdrawn && (
                <>
                    <p>
                        You have <NumberAsWords max={100} value={withdrawn} /> withdrawn submission
                        {accepted === 1 ? "" : "s"}. Click on {accepted === 1 ? "it" : "any of them"} to reconsider, if
                        you like. Or, <SpawnLink>upload a new one!</SpawnLink>
                    </p>
                </>
            )}
            <ImagePaginator filter={filter}>
                {images => (
                    <ImageGrid>
                        {images.map(image => (
                            <AnchorLink key={image.uuid} href={`/edit/${encodeURIComponent(image.uuid)}`}>
                                <ImageThumbnailView value={image} />
                            </AnchorLink>
                        ))}
                    </ImageGrid>
                )}
            </ImagePaginator>
        </>
    )
}
export default Complete
