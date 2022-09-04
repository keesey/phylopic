import { Loader } from "@phylopic/ui"
import { Hash, Identifier } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useState } from "react"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_X } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import SubmissionNameView from "~/ui/SubmissionNameView"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import AssignmentContainer from "./AssignmentContainer"
import useDispatch from "./AssignmentContainer/hooks/useDispatch"
import NodeForm from "./NodeForm"
export type Props = {
    hash: Hash
}
const Assignment: FC<Props> = ({ hash }) => {
    const submission = useSubmission(hash)
    const [pending, setPending] = useState(false)
    const [changeRequested, setChangeRequested] = useState(false)
    const mutate = useSubmissionMutator(hash)
    const router = useRouter()
    if (!submission) {
        return null
    }
    return (
        <AssignmentContainer
            initialState={{ changeRequested: false, hash, parentRequested: false, pending: false, text: "" }}
        >
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
                        <NodeForm />
                    </>
                )}
                {pending && <Loader />}
                {!pending && submission.identifier && (
                    <>
                        <Speech mode="system">
                            <p>
                                So this is <strong>not</strong> <SubmissionNameView value={submission} mode="full" />?
                            </p>
                        </Speech>
                        {!changeRequested && (
                            <UserOptions>
                                <UserLinkButton icon={ICON_CHECK} href={`/edit/${encodeURIComponent(hash)}`}>
                                    <p>
                                        Wait, it <strong>is</strong>{" "}
                                        <SubmissionNameView value={submission} mode="short" />.
                                    </p>
                                </UserLinkButton>
                                <UserButton danger icon={ICON_X} onClick={() => setChangeRequested(true)}>
                                    <p>
                                        It is not <SubmissionNameView value={submission} mode="short" />.
                                    </p>
                                </UserButton>
                            </UserOptions>
                        )}
                        {changeRequested && (
                            <>
                                <Speech mode="user">
                                    <p>
                                        It is not <SubmissionNameView value={submission} mode="short" />.
                                    </p>
                                </Speech>
                                <Speech mode="system">
                                    <p>
                                        <strong>Really?</strong> What is it, then?
                                    </p>
                                </Speech>
                                <NodeForm />
                            </>
                        )}
                    </>
                )}
            </Dialogue>
        </AssignmentContainer>
    )
}
export default Assignment
