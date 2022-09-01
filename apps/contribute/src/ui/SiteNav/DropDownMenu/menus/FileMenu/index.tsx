import { isSubmission, Submission } from "@phylopic/source-models"
import { Hash } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"
import useSubmissionDeletor from "~/editing/useSubmissionDeletor"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import { ICON_CHECK, ICON_DANGER, ICON_PLUS, ICON_X } from "~/ui/ICON_SYMBOLS"
import MenuButton from "../../MenuButton"
import MenuDivider from "../../MenuDivider"
import MenuLink from "../../MenuLink"
export type Props = {
    submissionHash?: Hash
    submission?: Submission
}
const FileMenu: FC<Props> = ({ submission, submissionHash }) => {
    const submittable = useMemo(() => isSubmission({ ...submission, submitted: true }), [submission])
    const mutator = useSubmissionMutator(submissionHash)
    const deletor = useSubmissionDeletor(submissionHash)
    const withdraw = useCallback(() => {
        if (confirm("Are you sure you’re not ready to submit this one?")) {
            mutator({ status: "incomplete" })
        }
    }, [mutator])
    const submit = useCallback(() => {
        mutator({ status: "submitted" })
    }, [mutator])
    const router = useRouter()
    const deleteSubmission = useCallback(() => {
        if (confirm("Are you sure you want to PERMANENTLY delete this submission? It’s so nice!")) {
            deletor()
            router.push("/")
        }
    }, [deletor, router])
    return (
        <>
            <MenuLink icon={ICON_PLUS} label="Upload New Image" href="/upload" />
            {submission && (
                <>
                    <MenuDivider />
                    {submission.status === "incomplete" && submittable && (
                        <MenuButton icon={ICON_CHECK} label="Submit this Image" onClick={submit} />
                    )}
                    {submission.status === "submitted" && (
                        <MenuButton icon={ICON_X} label="Withdraw this Submission" onClick={withdraw} />
                    )}
                    <MenuButton
                        icon={ICON_DANGER}
                        label={`Delete this ${submission.status === "submitted" ? "Submission" : "Image"}`}
                        onClick={deleteSubmission}
                    />
                </>
            )}
        </>
    )
}
export default FileMenu
