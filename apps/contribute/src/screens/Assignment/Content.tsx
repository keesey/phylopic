import { Loader } from "@phylopic/ui"
import { FC } from "react"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_X } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import SubmissionNameView from "~/ui/SubmissionNameView"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import useAssignmentSubmission from "./AssignmentContainer/hooks/useAssignmentSubmission"
import useChangeRequested from "./AssignmentContainer/hooks/useChangeRequested"
import useDispatch from "./AssignmentContainer/hooks/useDispatch"
import usePending from "./AssignmentContainer/hooks/usePending"
import useSubmissionHash from "./AssignmentContainer/hooks/useSubmissionHash"
import NodeForm from "./NodeForm"
import LoadingState from "../LoadingState"
const Content: FC = () => {
    const changeRequested = useChangeRequested()
    const pending = usePending()
    const hash = useSubmissionHash()
    const submission = useAssignmentSubmission()
    const dispatch = useDispatch()
    if (!hash || !submission) {
        return <LoadingState>Loading submission…</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <FileView
                    src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/files/${encodeURIComponent(hash)}`}
                    mode="light"
                />
            </Speech>
            {pending && <Loader />}
            {!pending && !submission.identifier && (
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
                                    Wait, it <strong>is</strong> <SubmissionNameView value={submission} mode="short" />.
                                </p>
                            </UserLinkButton>
                            <UserButton danger icon={ICON_X} onClick={() => dispatch?.({ type: "REQUEST_CHANGE" })}>
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
    )
}
export default Content
