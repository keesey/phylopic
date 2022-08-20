import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import ImagePaginator from "~/pagination/ImagePaginator"
import NumberAsWords from "~/ui/NumberAsWords"
import SpawnButton from "~/ui/SpawnButton"
import Speech from "~/ui/Speech"
import UserImageThumbnail from "~/ui/UserImageThumbnail"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
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
                <Speech mode="system">
                    <p>
                        You have{" "}
                        <strong>
                            <NumberAsWords max={100} value={submitted} />
                        </strong>{" "}
                        submission{submitted === 1 ? "" : "s"} awaiting review. You may click on{" "}
                        {submitted === 1 ? "it" : "any of them"} to make revisions first, if you want.
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
                </Speech>
            )}
            {!hasSubmitted && hasAccepted && (
                <Speech mode="system">
                    <p>
                        You have <NumberAsWords max={100} value={accepted} /> accepted submission
                        {accepted === 1 ? "" : "s"}. Click on {accepted === 1 ? "it" : "any of them"} to edit{" "}
                        {accepted === 1 ? "it" : "them"}, if you want.
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
                </Speech>
            )}
            {!hasSubmitted && !hasAccepted && hasWithdrawn && (
                <Speech mode="system">
                    <p>
                        You have <NumberAsWords max={100} value={withdrawn} /> withdrawn submission
                        {accepted === 1 ? "" : "s"}. Click on {accepted === 1 ? "it" : "any of them"} to reconsider, if
                        you like.
                    </p>
                </Speech>
            )}
            <UserOptions>
                <SpawnButton>Upload a new silhouette.</SpawnButton>
                <ImagePaginator filter={filter}>
                    {images => (
                        <>
                            {images.map(image => (
                                <UserLinkButton key={image.uuid} href={`/edit/${encodeURIComponent(image.uuid)}`}>
                                    <UserImageThumbnail uuid={image.uuid} />
                                </UserLinkButton>
                            ))}
                        </>
                    )}
                </ImagePaginator>
            </UserOptions>
        </>
    )
}
export default Complete
