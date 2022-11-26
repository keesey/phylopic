import { isUUIDish, normalizeText } from "@phylopic/utils"
import clsx from "clsx"
import { useRouter } from "next/router"
import { FC, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollectionImages from "~/collections/hooks/useCurrentCollectionImages"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import styles from "./index.module.scss"
import axios from "axios"
import { Collection, Link } from "@phylopic/api-models"
import { NumberView } from "@phylopic/ui"
export interface Props {
    name: string
}
const Tab: FC<Props> = ({ name }) => {
    const currentName = useCurrentCollectionName()
    const currentImages = useCurrentCollectionImages()
    const [, dispatch] = useContext(CollectionsContext)
    const router = useRouter()
    const handleDeleteClick = () => {
        if (confirm(`Are you sure you want to delete this collection (“${name}”)?`)) {
            dispatch({ type: "REMOVE_COLLECTION", payload: name })
        }
    }
    const handleLinkClick = () => {
        const uuids = currentImages.map(image => image.uuid)
        void (async () => {
            try {
                const response = await axios.post<Collection>(process.env.NEXT_PUBLIC_API_URL + "/collections", uuids)
                if (isUUIDish(response?.data?.uuid)) {
                    router.push(`/imagesets/${encodeURIComponent(response.data.uuid)}`)
                }
            } catch (e) {
                alert("There was an error creating the Collection Page.")
            }
        })()
    }
    const handleSelectClick = () => dispatch({ type: "SET_CURRENT_COLLECTION", payload: name })
    const handleRenameClick = () => {
        const newName = normalizeText(prompt("What do you want to rename this collection to?", name) ?? "")
        if (newName) {
            dispatch({ type: "RENAME_COLLECTION", payload: [name, newName] })
        }
    }
    return (
        <div className={clsx(styles.main, name === currentName ? styles.selected : undefined)}>
            {name === currentName && (
                <>
                    <div>
                        <span className={styles.label}>{name}</span>{" "}
                        <span>
                            (<NumberView value={currentImages.length} /> image{currentImages.length === 1 ? "" : "s"})
                        </span>
                    </div>
                    <div className={styles.controls}>
                        <a
                            onClick={handleLinkClick}
                            className={clsx(styles.icon)}
                            role="button"
                            title="Open Collection Page"
                        >
                            ↗
                        </a>
                        <a
                            onClick={handleRenameClick}
                            className={clsx(styles.icon)}
                            role="button"
                            title="Rename Collection"
                        >
                            ✎
                        </a>
                        <a
                            onClick={handleDeleteClick}
                            className={clsx(styles.icon)}
                            role="button"
                            title="Delete Collection"
                        >
                            ✖
                        </a>
                    </div>
                </>
            )}
            {name !== currentName && (
                <a onClick={handleSelectClick} className={styles.label} role="button" title="Select Collection">
                    {name}
                </a>
            )}
        </div>
    )
}
export default Tab
