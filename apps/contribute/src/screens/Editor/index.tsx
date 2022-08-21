import { LICENSE_NAMES, UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useState } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageDeletor from "~/editing/hooks/useImageDeletor"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import useLiveImageExists from "~/editing/hooks/useLiveImageExists"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_ARROW_LEFT, ICON_DANGER, ICON_PENCIL, ICON_X } from "~/ui/ICON_SYMBOLS"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import UserVerification from "../../ui/UserVerification"
import LoadingState from "../LoadingState"
export type Props = {
    uuid: UUID
}
const Editor: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const isLive = useLiveImageExists(uuid)
    const src = useImageSrc(uuid)
    const general = useImageNode(uuid, "general")
    const specific = useImageNode(uuid, "specific")
    const [unready, setUnready] = useState<boolean | null>(null)
    const mutate = useImageMutator(uuid)
    const submit = useCallback(() => mutate({ submitted: true }), [mutate])
    const withdraw = useCallback(() => {
        if (
            confirm(
                `Are you really sure you want to ${
                    image?.accepted ? "remove this image from the site" : "withdraw this submission"
                }? It's so nice!`,
            )
        ) {
            mutate({ submitted: false })
            if (image?.accepted) {
                alert("The image will be removed in the next build.")
            }
        }
    }, [image?.accepted, mutate])
    const deletor = useImageDeletor(uuid)
    const deleteImage = useCallback(() => {
        if (confirm("Are you sure you want to PERMANENTLY delete this submission?")) {
            deletor()
            alert("The image has been deleted and will be removed from the site in the next build.")
        }
    }, [deletor])
    const router = useRouter()
    const openWithConfirmation = useCallback(
        (path: "file" | "nodes" | "usage") => {
            if (
                !image?.accepted ||
                confirm("This submission has already been accepted. Are you sure you want to edit it?")
            ) {
                router.push(`/edit/${encodeURIComponent(uuid)}/${path}`)
            }
        },
        [image?.accepted, router, uuid],
    )
    if (!image || !src) {
        return <LoadingState>Checking contribution status&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <SpeechStack>
                    <figure>
                        <FileView mode="light" src={src} />
                    </figure>
                    <figcaption>
                        <p>
                            This is a silhouette image
                            {specific && (
                                <>
                                    {" "}
                                    of{" "}
                                    <strong>
                                        <NameView value={specific.names[0]} />
                                    </strong>
                                </>
                            )}
                            {image.attribution && (
                                <>
                                    {" "}
                                    by <strong>{image.attribution}</strong>
                                </>
                            )}
                            .
                            {image.sponsor && (
                                <>
                                    {" "}
                                    Its inclusion on the site was sponsored by <strong>{image.sponsor}</strong>.
                                </>
                            )}
                        </p>
                        {general && (
                            <p>
                                <small>
                                    (It also represents the ancestral state of{" "}
                                    <strong>
                                        <NameView value={general.names[0]} />
                                    </strong>
                                    .)
                                </small>
                            </p>
                        )}
                        {image.license && (
                            <p>
                                It is available under the{" "}
                                <strong>
                                    <a href={image.license} className="text" target="_blank" rel="noreferrer">
                                        {LICENSE_NAMES[image.license] ?? "[Unknown License]"}
                                    </a>
                                </strong>{" "}
                                license.
                            </p>
                        )}
                    </figcaption>
                </SpeechStack>
            </Speech>
            {!image.accepted && !image.submitted && (
                <>
                    <Speech mode="system">
                        <p>
                            <strong>Wonderful!</strong> Are you ready to submit it for review?
                        </p>
                    </Speech>
                    <UserVerification
                        affirmed={unready === null ? null : !unready}
                        affirmation={<>Let&rsquo;s do it.</>}
                        denial={<>Not quite.</>}
                        onAffirm={submit}
                        onDeny={() => setUnready(true)}
                    />
                </>
            )}
            {image.accepted && !image.submitted && (
                <>
                    <Speech mode="system">
                        <p>Would you like to reconsider your decision to withdraw this image?</p>
                    </Speech>
                    <UserVerification
                        affirmed={unready === null ? null : !unready}
                        affirmation={<>Yes, add it back to the site.</>}
                        denial={<>No, I want to delete it.</>}
                        onAffirm={submit}
                        onDeny={deleteImage}
                    />
                </>
            )}
            {(image.submitted || unready) && (
                <>
                    <Speech mode="system">
                        {image.accepted && (
                            <p>
                                This image has been reviewed and accepted.
                                {isLive && (
                                    <>
                                        {" "}
                                        It is currently{" "}
                                        <a
                                            href={`https://${
                                                process.env.NEXT_PUBLIC_WWW_DOMAIN
                                            }/images/${encodeURIComponent(uuid)}`}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            featured on the site
                                        </a>
                                        .
                                    </>
                                )}
                                {isLive === false && (
                                    <>
                                        {" "}
                                        <strong>Congrats!</strong> It will be added to the site in the next build.
                                    </>
                                )}
                            </p>
                        )}
                        {!image.accepted && image.submitted && (
                            <p>
                                <strong>Sweet.</strong> This image has been submitted for review.
                            </p>
                        )}
                        <p>What would you like to do?</p>
                    </Speech>
                    <UserOptions>
                        <UserLinkButton href="/" icon={ICON_ARROW_LEFT}>
                            Go back to the overview.
                        </UserLinkButton>
                        <UserButton onClick={() => openWithConfirmation("file")} icon={ICON_PENCIL}>
                            Revise the image file.
                        </UserButton>
                        <UserButton onClick={() => openWithConfirmation("nodes")} icon={ICON_PENCIL}>
                            Revise the taxonomic assignment.
                        </UserButton>
                        <UserButton onClick={() => openWithConfirmation("usage")} icon={ICON_PENCIL}>
                            Revise the license or attribution.
                        </UserButton>
                        {image.submitted && (
                            <UserButton danger icon={image.accepted ? ICON_DANGER : ICON_X} onClick={withdraw}>
                                {!image.accepted && "Withdraw this submission."}
                                {image.accepted && "Remove this image."}
                            </UserButton>
                        )}
                        {!image.submitted && (
                            <UserButton icon={ICON_DANGER} danger onClick={deleteImage}>
                                Delete this submission.
                            </UserButton>
                        )}
                    </UserOptions>
                </>
            )}
        </Dialogue>
    )
}
export default Editor
