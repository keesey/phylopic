"use client"
import { useContext } from "react"
import { EditorContext, select } from "~/lib/edit"
import styles from "./SaveButton.module.scss"
export const SaveButton = () => {
    const [state] = useContext(EditorContext) ?? []
    return (
        <button className={styles.main} disabled={!state || !select.canSave(state)}>
            Save
        </button>
    )
}
