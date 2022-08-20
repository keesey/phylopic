import { LICENSE_NAMES, UUID } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageDeletor from "~/editing/hooks/useImageDeletor"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import useLiveImageExists from "~/editing/hooks/useLiveImageExists"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_ARROW_LEFT, ICON_ARROW_UP, ICON_DANGER, ICON_PENCIL, ICON_X } from "~/ui/ICON_SYMBOLS"
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
    const [unready, setUnready] = useState(false)
    const deletor = useImageDeletor(uuid)
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
        }
    }, [image?.accepted, mutate])
    const deleteImage = useCallback(() => {
        if (confirm("Are you sure you want to PERMANENTLY delete this submission?")) {
            deletor()
        }
    }, [deletor])
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
                                    of <NameView value={specific.names[0]} />
                                </>
                            )}
                            {image.attribution && <> by {image.attribution}</>}
                            {image.sponsor && <> (sponsored by {image.sponsor})</>}.
                        </p>
                        {general && (
                            <p>
                                <small>
                                    (It also represents the ancestral state of <NameView value={general.names[0]} />
                                    .)
                                </small>
                            </p>
                        )}
                        {image.license && (
                            <p>
                                It is available under the{" "}
                                <a href={image.license} className="text" target="_blank" rel="noopener noferrer">
                                    {LICENSE_NAMES[image.license] ?? "[Unknown License]"}
                                </a>{" "}
                                license.
                            </p>
                        )}
                    </figcaption>
                </SpeechStack>
            </Speech>
            {!image.submitted && (
                <>
                    <Speech mode="system">
                        <p>
                            <strong>Wonderful!</strong> Are you ready to submit it for review?
                        </p>
                    </Speech>
                    <UserVerification
                        affirmation={<>Let&rsquo;s do it.</>}
                        denial={<>Not quite.</>}
                        onAffirm={submit}
                        onDeny={() => setUnready(true)}
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
                            </p>
                        )}
                        {!image.accepted && image.submitted && <p>This image has been submitted for review.</p>}
                        <p>What would you like to do?</p>
                    </Speech>
                    <UserOptions>
                        <UserLinkButton href="/" icon={ICON_ARROW_LEFT}>
                            Go back to the Home Page.
                        </UserLinkButton>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/file`} icon={ICON_ARROW_UP}>
                            Upload a different file.
                        </UserLinkButton>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/nodes`} icon={ICON_PENCIL}>
                            Change the taxonomic assignment.
                        </UserLinkButton>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/usage`} icon={ICON_PENCIL}>
                            Change the license or attribution.
                        </UserLinkButton>
                        {image.submitted && (
                            <UserButton danger icon={image.accepted ? ICON_DANGER : ICON_X} onClick={withdraw}>
                                {!image.accepted && "Withdraw this submission."}
                                {image.accepted && "Remove this image from the site."}
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
