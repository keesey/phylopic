import { isSubmission } from "@phylopic/source-models"
import { LICENSE_NAMES, UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo, useState } from "react"
import useSubmission from "~/editing/useSubmission"
import useSubmissionDeletor from "~/editing/useSubmissionDeletor"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
import IdentifierView from "~/ui/IdentifierView"
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
    const submission = useSubmission(uuid)
    const submittable = useMemo(
        () => !submission?.submitted && isSubmission({ ...submission, submitted: true }),
        [submission],
    )
    const [unready, setUnready] = useState<boolean | null>(null)
    const mutate = useSubmissionMutator(uuid)
    const submit = useCallback(() => mutate({ submitted: true }), [mutate])
    const deletor = useSubmissionDeletor(uuid)
    const deleteImage = useCallback(() => {
        if (confirm("Are you sure you want to PERMANENTLY delete this submission?")) {
            deletor()
        }
    }, [deletor])
    if (!submission) {
        return <LoadingState>Checking submission status&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <SpeechStack collapsible>
                    <figure>
                        <FileView
                            src={`https://${process.env.NEXT_PUBLIC_UPLOADS_DOMAIN}/files/${encodeURIComponent(
                                submission.file,
                            )}`}
                            mode="light"
                        />
                        <figcaption>
                            <p>
                                This is a silhouette image
                                {submission.identifier && (
                                    <>
                                        {" "}
                                        of{" "}
                                        <strong>
                                            <IdentifierView value={submission.identifier} />
                                        </strong>
                                    </>
                                )}
                                {submission.attribution && (
                                    <>
                                        {" "}
                                        by <strong>{submission.attribution}</strong>
                                    </>
                                )}
                                .
                                {submission.sponsor && (
                                    <>
                                        {" "}
                                        It has been sponsored by <strong>{submission.sponsor}</strong>.
                                    </>
                                )}
                            </p>
                            {submission.license && (
                                <p>
                                    It is available under the{" "}
                                    <strong>
                                        <a href={submission.license} className="text" target="_blank" rel="noreferrer">
                                            {LICENSE_NAMES[submission.license] ?? "[Unknown License]"}
                                        </a>
                                    </strong>{" "}
                                    license.
                                </p>
                            )}
                        </figcaption>
                    </figure>
                </SpeechStack>
            </Speech>
            {!submission.submitted && submittable && (
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
                                    Change the file.
                                </UserLinkButton>
                                <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/nodes`} icon={ICON_PENCIL}>
                                    Change the taxonomic assignment.
                                </UserLinkButton>
                                <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/usage`} icon={ICON_PENCIL}>
                                    "Change the license or attribution.
                                </UserLinkButton>
                                <UserButton icon={ICON_CHECK} onClick={submit}>
                                    You know what? I am ready to submit it.
                                </UserButton>
                            </UserOptions>
                        </>
                    )}
                </>
            )}
            {!submission.submitted && !submittable && (
                <>
                    <Speech mode="system">
                        <p>Looks like you&rsquo;ve got some work left to do on this. Where do you want to start?</p>
                    </Speech>
                    <UserOptions>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/file`} icon={ICON_PENCIL}>
                            Change the file.
                        </UserLinkButton>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/nodes`} icon={ICON_PENCIL}>
                            {submission.identifier ? "Change the taxonomic assignment." : "Assign the taxon."}
                        </UserLinkButton>
                        <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}/usage`} icon={ICON_PENCIL}>
                            {submission.license ? "Change the license or attribution." : "Pick a license."}
                        </UserLinkButton>
                    </UserOptions>
                </>
            )}
            {submission.submitted && (
                <>
                    <Speech mode="system">
                        <p>
                            <strong>Sweet.</strong> This image has been submitted for review.
                        </p>
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
