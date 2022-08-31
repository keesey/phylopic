import { isSubmission, Submission } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"
import useSubmissionDeletor from "~/editing/useSubmissionDeletor"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import { ICON_CHECK, ICON_DANGER, ICON_PLUS, ICON_X } from "~/ui/ICON_SYMBOLS"
import MenuButton from "../../MenuButton"
import MenuDivider from "../../MenuDivider"
import MenuLink from "../../MenuLink"
export type Props = {
    submission?: Submission & { uuid: UUID }
}
const FileMenu: FC<Props> = ({ submission }) => {
    const submittable = useMemo(() => isSubmission({...submission, submitted: true }), [submission])
    const mutator = useSubmissionMutator(submission?.uuid)
    const deletor = useSubmissionDeletor(submission?.uuid)
    const withdraw = useCallback(() => {
        if (confirm("Are you sure you’re not ready to submit this one?")) {
            mutator({ submitted: false })
        }
    }, [mutator])
    const submit = useCallback(() => {
        mutator({ submitted: true })
    }, [mutator])
    const router = useRouter()
    const deleteSubmission = useCallback(() => {
        if (confirm("Are you sure you want to PERMANENTLY delete this submission?")) {
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
                    {!submission.submitted && submittable && (
                        <MenuButton icon={ICON_CHECK} label="Submit this Image" onClick={submit} />
                    )}
                    {submission.submitted && (
                        <MenuButton icon={ICON_X} label="Withdraw this Submission" onClick={withdraw} />
                    )}
                    <MenuButton icon={ICON_DANGER} label={`Delete this ${submission.submitted ? "Submission" : "Image"}`} onClick={deleteSubmission} />
                </>
            )}
        </>
    )
}
export default FileMenu
