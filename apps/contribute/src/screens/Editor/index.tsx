import { isSubmission, Submission } from "@phylopic/source-models"
import { Hash, LICENSE_NAMES } from "@phylopic/utils"
import { FC, Fragment, useCallback, useMemo, useState } from "react"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_PENCIL, ICON_PLUS, ICON_QUESTION } from "~/ui/ICON_SYMBOLS"
import IdentifierView from "~/ui/IdentifierView"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import NameRenderer from "../Assignment/NodeForm/NameRenderer"
import LoadingState from "../LoadingState"
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
                            {submission.tags && (
                                <p>
                                    It has been assigned{" "}
                                    {submission.tags.includes(",") ? "the following tags" : "one tag"}:{" "}
                                    {submission.tags.split(",").map((tag, index) => (
                                        <Fragment key={tag}>
                                            {index > 0 && ", "}
                                            <strong>{tag}</strong>
                                        </Fragment>
                                    ))}
                                    .
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
                            <strong>Wonderful!</strong> Are you ready to submit it for review? Or do you want to change
                            something?
                            {submission.tags?.length ? null : <> Or maybe add a tag or two?</>}
                        </p>
                    </Speech>
                    {unready === null && (
                        <UserOptions>
                            <UserButton icon={ICON_CHECK} onClick={submit}>
                                Let&rsquo;s do it!
                            </UserButton>
                            {!submission.tags && (
                                <UserLinkButton icon={ICON_QUESTION} href={`/edit/${encodeURIComponent(hash)}/tags`}>
                                    Tags?
                                </UserLinkButton>
                            )}
                            <UserButton danger icon={ICON_PENCIL} onClick={() => setUnready(true)}>
                                I want to change something.
                            </UserButton>
                        </UserOptions>
                    )}
                    {unready !== null && (
                        <Speech mode="user">{unready ? "I want to change something." : <>Let&rsquo;s do it!</>}</Speech>
                    )}
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
                                {submission.tags && (
                                    <UserLinkButton href={`/edit/${encodeURIComponent(hash)}/tags`} icon={ICON_PENCIL}>
                                        Change the tags.
                                    </UserLinkButton>
                                )}
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
                    {!changeDesired && (
                        <UserOptions>
                            <UserLinkButton href="/" icon={ICON_CHECK}>
                                Cool.
                            </UserLinkButton>
                            <UserLinkButton href="/upload" icon={ICON_PLUS}>
                                Let&rsquo;s upload another!
                            </UserLinkButton>
                            <UserButton onClick={() => setChangeDesired(true)} icon={ICON_PENCIL}>
                                Wait, I want to change something.
                            </UserButton>
                        </UserOptions>
                    )}
                    {changeDesired && (
                        <>
                            <Speech mode="user">
                                <p>Wait, I want to change something.</p>
                            </Speech>
                            <Speech mode="system">
                                <p>What do you want to change?</p>
                            </Speech>
                            <UserOptions>
                                <UserLinkButton href={`/edit/${encodeURIComponent(hash)}/nodes`} icon={ICON_PENCIL}>
                                    The taxonomic assignment.
                                </UserLinkButton>
                                <UserLinkButton href={`/edit/${encodeURIComponent(hash)}/tags`} icon={ICON_PENCIL}>
                                    The tags.
                                </UserLinkButton>
                                <UserLinkButton href={`/edit/${encodeURIComponent(hash)}/usage`} icon={ICON_PENCIL}>
                                    The license or attribution.
                                </UserLinkButton>
                                <UserLinkButton href="/" icon={ICON_CHECK}>
                                    Never mind, it&rsquo;s fine.
                                </UserLinkButton>
                            </UserOptions>
                        </>
                    )}
                </>
            )}
        </Dialogue>
    )
}
export default Editor
