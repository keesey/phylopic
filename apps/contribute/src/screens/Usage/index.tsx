import { Hash, isPublicDomainLicenseURL, isValidLicenseURL } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import useContributor from "~/profile/useContributor"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_HAND_POINT_RIGHT, ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
import IdentifierView from "~/ui/IdentifierView"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import LoadingState from "../LoadingState"
import Attribution from "./Attribution"
import License from "./License"
export type Props = {
    hash: Hash
}
const Usage: FC<Props> = ({ hash }) => {
    const submission = useSubmission(hash)
    const contributor = useContributor()
    const hasLicense = useMemo(() => isValidLicenseURL(submission?.license), [submission?.license])
    const complete = useMemo(() => {
        return (
            isValidLicenseURL(submission?.license) &&
            (submission?.attribution || isPublicDomainLicenseURL(submission?.license))
        )
    }, [submission?.attribution, submission?.license])
    const mutate = useSubmissionMutator(hash)
    const newName = useMemo(
        () => (submission?.newTaxonName ? parseNomen(submission.newTaxonName) : null),
        [submission?.newTaxonName],
    )
    if (!submission) {
        return <LoadingState>One moment&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <SpeechStack collapsible>
                    <FileView
                        src={`https://${process.env.NEXT_PUBLIC_UPLOADS_DOMAIN}/files/${encodeURIComponent(hash)}`}
                        mode="light"
                    />
                    {(newName || submission.identifier) && (
                        <p>
                            This image shows{" "}
                            <strong>
                                {newName ? (
                                    <NameView value={newName} />
                                ) : (
                                    <IdentifierView value={submission.identifier!} />
                                )}
                            </strong>
                            .
                        </p>
                    )}
                </SpeechStack>
            </Speech>
            <Speech mode="system">
                <p>
                    <strong>Cool.</strong> How would you like to make this image available for reuse?
                </p>
            </Speech>
            <License hash={hash} />
            {hasLicense && <Attribution key="attribution" hash={hash} />}
            <UserOptions>
                {hasLicense && !submission.attribution && contributor?.name && (
                    <UserButton icon={ICON_HAND_POINT_RIGHT} onClick={() => mutate({ attribution: contributor.name })}>
                        I get the credit.
                    </UserButton>
                )}
                {hasLicense && submission.attribution && (
                    <UserButton
                        danger
                        icon={ICON_PENCIL}
                        onClick={() => mutate({ status: "incomplete", attribution: null })}
                    >
                        Change the attribution.
                    </UserButton>
                )}
                {complete && (
                    <UserLinkButton icon={ICON_CHECK} href={`/edit/${encodeURIComponent(hash)}`}>
                        All done.{!submission.attribution && " No credit needed."}
                    </UserLinkButton>
                )}
            </UserOptions>
        </Dialogue>
    )
}
export default Usage
