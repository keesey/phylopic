import { Identifier, UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useState } from "react"
import useSubmission from "~/editing/hooks/useSubmission"
import useSubmissionMutator from "~/editing/hooks/useSubmissionMutator"
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
    uuid: UUID
}
const Assignment: FC<Props> = ({ uuid }) => {
    const submission = useSubmission(uuid)
    const [changeRequested, setChangeRequested] = useState(false)
    const mutate = useSubmissionMutator(uuid)
    const router = useRouter()
    const handleComplete = useCallback(
        (identifier: Identifier, newTaxonName: string | null) => {
            setChangeRequested(false)
            mutate({ identifier, newTaxonName })
            router.push(`/edit/${encodeURIComponent(uuid)}`)
        },
        [mutate, router, uuid],
    )
    if (!submission) {
        return null
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <FileView
                    src={`https://${process.env.NEXT_PUBLIC_UPLOADS_DOMAIN}/files/${encodeURIComponent(
                        submission.file,
                    )}`}
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
                            <UserLinkButton icon={ICON_CHECK} href={`/edit/${encodeURIComponent(uuid)}`}>
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
