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
    const mutator = useSubmissionMutator(submissionHash)
    const deletor = useSubmissionDeletor(submissionHash)
    const withdraw = useCallback(async () => {
        if (confirm("Are you sure you’re not ready to submit this one?")) {
            await mutator({ status: "incomplete" })
        }
    }, [mutator])
    const submit = useCallback(async () => {
        await mutator({ status: "submitted" })
    }, [mutator])
    const router = useRouter()
    const deleteSubmission = useCallback(async () => {
        if (confirm("Are you sure you want to PERMANENTLY delete this submission? It’s so nice!")) {
            await deletor()
            await router.push("/")
        }
    }, [deletor, router])
    const submittable = useMemo(() => isSubmission({ ...submission, status: "submitted" } as Submission), [submission])
    return (
        <>
            <MenuLink icon={ICON_PLUS} label="Upload New Image" href="/upload" />
            {submission && (
                <>
                    <MenuDivider />
                    {submission.status === "incomplete" && (
                        <MenuButton
                            disabled={!submittable}
                            icon={ICON_CHECK}
                            label="Submit this Image"
                            onClick={submit}
                        />
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
