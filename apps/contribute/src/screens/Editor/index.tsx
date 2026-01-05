import { isSubmission, Submission } from "@phylopic/source-models"
import { Hash, LICENSE_NAMES } from "@phylopic/utils"
import { FC, useCallback, useMemo, useState } from "react"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import DeletionConfirmation from "~/ui/DeletionConfirmation"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_DANGER, ICON_PENCIL, ICON_PLUS } from "~/ui/ICON_SYMBOLS"
import IdentifierView from "~/ui/IdentifierView"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import UserVerification from "../../ui/UserVerification"
import NameRenderer from "../Assignment/NodeForm/NameRenderer"
import LoadingState from "../LoadingState"
import useAuthorizedSubmissionDeletor from "./useAuthorizedSubmissionDeletor"
export type Props = {
    hash: Hash
}
const Editor: FC<Props> = ({ hash }) => {
    const submission = useSubmission(hash)
    const submittable = useMemo(
        () => submission?.status === "incomplete" && isSubmission({ ...submission, status: "submitted" } as Submission),
        [submission],
    )
    const [unready, setUnready] = useState<boolean | null>(null)
    const [changeDesired, setChangeDesired] = useState(false)
    const mutate = useSubmissionMutator(hash)
    const submit = useCallback(() => mutate({ status: "submitted" }), [mutate])
    const deletor = useAuthorizedSubmissionDeletor(hash)
    const [deletionRequested, setDeletionRequested] = useState(false)
    if (!submission) {
        return <LoadingState>Checking submission status&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <SpeechStack collapsible>
                    <figure>
                        <FileView
                            src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/files/${encodeURIComponent(hash)}`}
                            mode="light"
                        />
                        <br />
                        <figcaption>
                            <p>
                                This is a silhouette image
                                {submission.identifier && (
                                    <>
                                        {" "}
                                        of{" "}
                                        <strong>
                                            {submission.newTaxonName && (
                                                <NameRenderer value={submission.newTaxonName} />
                                            )}
                                            {!submission.newTaxonName && (
                                                <IdentifierView value={submission.identifier} />
                                            )}
                                        </strong>
                                        {submission.newTaxonName && (
                                            <>
                                                {" "}
                                                (<IdentifierView value={submission.identifier} short />)
                                            </>
                                        )}
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
            {submission.status === "incomplete" && submittable && (
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
                                <UserLinkButton href={`/edit/${encodeURIComponent(hash)}/nodes`} icon={ICON_PENCIL}>
                                    Change the taxonomic assignment.
                                </UserLinkButton>
                                <UserLinkButton href={`/edit/${encodeURIComponent(hash)}/usage`} icon={ICON_PENCIL}>
                                    Change the license or attribution.
                                </UserLinkButton>
                                <UserButton icon={ICON_CHECK} onClick={submit}>
                                    You know what? I am ready to submit it.
                                </UserButton>
                            </UserOptions>
                        </>
                    )}
                </>
            )}
            {submission.status === "incomplete" && !submittable && (
                <>
                    <Speech mode="system">
                        <p>Looks like you&rsquo;ve got some work left to do on this. Where do you want to start?</p>
                    </Speech>
                    <UserOptions>
                        <UserLinkButton href={`/edit/${encodeURIComponent(hash)}/nodes`} icon={ICON_PENCIL}>
                            {submission.identifier ? "Change the taxonomic assignment." : "Assign the taxon."}
                        </UserLinkButton>
                        <UserLinkButton href={`/edit/${encodeURIComponent(hash)}/usage`} icon={ICON_PENCIL}>
                            {submission.license ? "Change the license or attribution." : "Pick a license."}
                        </UserLinkButton>
                    </UserOptions>
                </>
            )}
            {submission.status === "submitted" && (
                <>
                    <Speech mode="system">
                        <p>
                            <strong>Sweet.</strong> This image has been submitted for review.
                        </p>
                    </Speech>
                    {!deletionRequested && (
                        <UserOptions>
                            <UserLinkButton href="/" icon={ICON_CHECK}>
                                Cool.
                            </UserLinkButton>
                            <UserLinkButton href="/upload" icon={ICON_PLUS}>
                                Let&rsquo;s upload another!
                            </UserLinkButton>
                            <UserButton icon={ICON_DANGER} danger onClick={() => setDeletionRequested(true)}>
                                Delete this submission.
                            </UserButton>
                        </UserOptions>
                    )}
                    {deletionRequested && (
                        <>
                            <Speech mode="user">
                                <p>Delete this submission.</p>
                            </Speech>
                            <DeletionConfirmation
                                {...deletor}
                                onCancel={() => setDeletionRequested(false)}
                                onConfirm={deletor.mutate}
                            />
                        </>
                    )}
                </>
            )}
        </Dialogue>
    )
}
export default Editor
