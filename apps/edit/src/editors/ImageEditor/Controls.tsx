import { stringifyNormalized } from "@phylopic/utils"
import { useContext, useEffect, useMemo, FC } from "react"
import Context from "~/contexts/ImageEditorContainer/Context"
import useSave from "~/contexts/ImageEditorContainer/useSave"
import styles from "./Controls.module.scss"

const Controls: FC = () => {
    const [state, dispatch] = useContext(Context) ?? []
    const save = useSave()
    const { error, modified, original, pending } = state || {}
    const changed = useMemo(() => stringifyNormalized(modified) !== stringifyNormalized(original), [modified, original])
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    const className = [styles.main, (!changed || !dispatch) && styles.hidden].filter(Boolean).join(" ")
    return (
        <nav className={className}>
            <button disabled={pending} onClick={() => dispatch?.({ type: "RESET" })}>
                Reset
            </button>
            <button disabled={Boolean(error) || pending} onClick={!error ? save : undefined}>
                Save
            </button>
        </nav>
    )
}
export default Controls
