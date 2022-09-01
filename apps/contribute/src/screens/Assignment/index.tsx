import { Hash, Identifier } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useState } from "react"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_X } from "~/ui/ICON_SYMBOLS"
import IdentifierView from "~/ui/IdentifierView"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import NodeForm from "./NodeForm"
export type Props = {
    hash: Hash
}
const Assignment: FC<Props> = ({ hash }) => {
    const submission = useSubmission(hash)
    const [changeRequested, setChangeRequested] = useState(false)
    const mutate = useSubmissionMutator(hash)
    const router = useRouter()
    const handleComplete = useCallback(
        (identifier: Identifier, newTaxonName?: string) => {
            setChangeRequested(false)
            mutate({ identifier, newTaxonName })
            router.push(`/edit/${encodeURIComponent(hash)}`)
        },
        [hash, mutate, router],
    )
    if (!submission) {
        return null
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <FileView
                    src={`https://${process.env.NEXT_PUBLIC_UPLOADS_DOMAIN}/files/${encodeURIComponent(hash)}`}
                    mode="light"
                />
            </Speech>
            {!submission.identifier && (
                <>
                    <Speech mode="system">
                        <p>
                            <strong>Looks great!</strong> What is it?
                        </p>
                        <p>
                            <small>(Please be as specific as possible.)</small>
                        </p>
                    </Speech>
                    <NodeForm key="nodeForm" onComplete={handleComplete} />
                </>
            )}
            {submission.identifier && (
                <>
                    <Speech mode="system">
                        <p>
                            So this is <IdentifierView value={submission.identifier} />?
                        </p>
                    </Speech>
                    {!changeRequested && (
                        <UserOptions>
                            <UserLinkButton icon={ICON_CHECK} href={`/edit/${encodeURIComponent(hash)}`}>
                                Yep.
                            </UserLinkButton>
                            <UserButton danger icon={ICON_X} onClick={() => setChangeRequested(true)}>
                                Nope.
                            </UserButton>
                        </UserOptions>
                    )}
                    {changeRequested && (
                        <>
                            <Speech mode="user">Nope.</Speech>
                            <Speech mode="system">Really??? What is it, then?</Speech>
                            <NodeForm key="nodeForm" onComplete={handleComplete} />
                        </>
                    )}
                </>
            )}
        </Dialogue>
    )
}
export default Assignment
