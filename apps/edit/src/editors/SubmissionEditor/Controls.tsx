import { stringifyNormalized } from "@phylopic/utils"
import { useContext, useEffect, useMemo, FC } from "react"
import Context from "~/contexts/SubmissionEditorContainer/Context"
import useApprove from "~/contexts/SubmissionEditorContainer/useApprove"
import useDelete from "~/contexts/SubmissionEditorContainer/useDelete"
import useSave from "~/contexts/SubmissionEditorContainer/useSave"
import styles from "./Controls.module.scss"

const Controls: FC = () => {
    const [state, dispatch] = useContext(Context) ?? []
    const approve = useApprove()
    const save = useSave()
    const del = useDelete()
    const { error, modified, original, pending } = state || {}
    const changed = useMemo(() => stringifyNormalized(modified) !== stringifyNormalized(original), [modified, original])
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    return (
        <nav className={styles.main}>
            <button disabled={!changed || pending} onClick={() => dispatch?.({ type: "RESET" })}>
                Reset
            </button>
            <button disabled={!changed || Boolean(error) || pending} onClick={!error ? save : undefined}>
                Save
            </button>
            <button disabled={changed || Boolean(error) || pending} onClick={!error ? approve : undefined}>
                Approve
            </button>
            <button disabled={pending} onClick={!error ? del : undefined}>
                Reject
            </button>
        </nav>
    )
}
export default Controls
