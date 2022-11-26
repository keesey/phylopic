import { normalizeText } from "@phylopic/utils"
import clsx from "clsx"
import { FC, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import styles from "./index.module.scss"
export interface Props {
    name: string
}
const Tab: FC<Props> = ({ name }) => {
    const currentName = useCurrentCollectionName()
    const [, dispatch] = useContext(CollectionsContext)
    const handleSelectClick = () => dispatch({ type: "SET_CURRENT_COLLECTION", payload: name })
    const handleRenameClick = () => {
        const newName = normalizeText(prompt("What do you want to rename this collection to?", name) ?? "")
        if (newName) {
            dispatch({ type: "RENAME_COLLECTION", payload: [name, newName] })
        }
    }
    const handleDeleteClick = () => {
        if (confirm(`Are you sure you want to delete this collection (“${name}”)?`)) {
            dispatch({ type: "REMOVE_COLLECTION", payload: name })
        }
    }
    return (
        <div className={clsx(styles.main, name === currentName ? styles.selected : undefined)}>
            {name === currentName && <span className={styles.label}>{name}</span>}
            {name !== currentName && (
                <a onClick={handleSelectClick} className={styles.label} role="button" title="Select Collection">
                    {name}
                </a>
            )}
            <div className={styles.controls}>
                <a onClick={handleRenameClick} className={clsx(styles.icon)} role="button" title="Rename Collection">
                    ✎
                </a>

                <a onClick={handleDeleteClick} className={clsx(styles.icon)} role="button" title="Delete Collection">
                    ✖
                </a>
            </div>
        </div>
    )
}
export default Tab
