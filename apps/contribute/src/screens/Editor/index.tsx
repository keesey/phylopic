import { isSubmittableImage } from "@phylopic/source-models"
import { LICENSE_NAMES, UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo, useState } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageDeletor from "~/editing/hooks/useImageDeletor"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import useLiveImageExists from "~/editing/hooks/useLiveImageExists"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
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
    const submittable = useMemo(() => isSubmittableImage(image), [image])
    const isLive = useLiveImageExists(uuid)
    const src = useImageSrc(uuid)
    const general = useImageNode(uuid, "general")
    const specific = useImageNode(uuid, "specific")
    const [unready, setUnready] = useState<boolean | null>(null)
    const mutate = useImageMutator(uuid)
    const submit = useCallback(() => mutate({ submitted: true }), [mutate])
    const deletor = useImageDeletor(uuid)
    const deleteImage = useCallback(() => {
        if (confirm("Are you sure you want to PERMANENTLY delete this submission?")) {
            deletor()
            alert("The image has been deleted and will be removed from the site in the next build.")
        }
    }, [deletor])
    if (!image || !src) {
        return <LoadingState>Checking contribution status&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <SpeechStack collapsible>
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
            {!image.accepted && !image.submitted && submittable && (
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
                    {unready && (
                        <>
                            <Speech mode="system">
                                <p>Well then, what do you want to do?</p>
                            </Speech>
                            <UserOptions>
                                <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/file`} icon={ICON_PENCIL}>
                                    {src ? "Change the file." : "Upload the file."}
                                </UserLinkButton>
                                <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/nodes`} icon={ICON_PENCIL}>
                                    {image.specific ? "Change the taxonomic assignment." : "Assign the taxon."}
                                </UserLinkButton>
                                <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/usage`} icon={ICON_PENCIL}>
                                    {image.license ? "Change the license or attribution." : "Pick a license."}
                                </UserLinkButton>
                                <UserButton icon={ICON_CHECK} onClick={submit}>
                                    You know what? I am ready to submit it.
                                </UserButton>
                            </UserOptions>
                        </>
                    )}
                </>
            )}
            {!image.accepted && !image.submitted && !submittable && (
                <>
                    <Speech mode="system">
                        <p>Looks like you&rsquo;ve got some work left to do on this. Where do you want to start?</p>
                    </Speech>
                    <UserOptions>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/file`} icon={ICON_PENCIL}>
                            {src ? "Change the file." : "Upload the file."}
                        </UserLinkButton>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/nodes`} icon={ICON_PENCIL}>
                            {image.specific ? "Change the taxonomic assignment." : "Assign the taxon."}
                        </UserLinkButton>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/usage`} icon={ICON_PENCIL}>
                            {image.license ? "Change the license or attribution." : "Pick a license."}
                        </UserLinkButton>
                    </UserOptions>
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
            {image.submitted && (
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
                        {!image.accepted && (
                            <p>
                                <strong>Sweet.</strong> This image has been submitted for review.
                            </p>
                        )}
                    </Speech>
                    <UserOptions>
                        <UserLinkButton href="/" icon={ICON_CHECK}>
                            Cool.
                        </UserLinkButton>
                    </UserOptions>
                </>
            )}
        </Dialogue>
    )
}
export default Editor
