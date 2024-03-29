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
import Icon from "~/ui/Icon"
import customEvents from "~/analytics/customEvents"
export interface Props {
    name: string
}
const Tab: FC<Props> = ({ name }) => {
    const currentName = useCurrentCollectionName()
    const currentImages = useCurrentCollectionImages()
    const [, dispatch] = useContext(CollectionsContext)
    const router = useRouter()
    const handleDeleteClick = () => {
        if (currentImages.length === 0 || confirm(`Are you sure you want to delete this collection (“${name}”)?`)) {
            customEvents.deleteCollection(name)
            dispatch({ type: "REMOVE_COLLECTION", payload: name })
        }
    }
    const handleLinkClick = () => {
        const uuids = currentImages.map(image => image.uuid)
        void (async () => {
            try {
                const response = await axios.post<Collection>(process.env.NEXT_PUBLIC_API_URL + "/collections", uuids)
                if (isUUIDish(response?.data?.uuid)) {
                    customEvents.toggleCollectionDrawer(false)
                    dispatch({ type: "CLOSE" })
                    customEvents.openCollectionPage(response.data.uuid, currentName)
                    await router.push(`/collections/${encodeURIComponent(response.data.uuid)}`)
                }
            } catch (e) {
                customEvents.exception(String(e))
                alert("There was an error creating the Collection Page.")
            }
        })()
    }
    const handleSelectClick = () => {
        customEvents.selectCollection(name)
        dispatch({ type: "SET_CURRENT_COLLECTION", payload: name })
    }
    const handleRenameClick = () => {
        const newName = normalizeText(prompt("What do you want to rename this collection to?", name) ?? "")
        if (newName) {
            customEvents.renameCollection(name, newName)
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
                        {currentImages.length > 1 && (
                            <a
                                onClick={handleLinkClick}
                                className={clsx(styles.icon)}
                                role="button"
                                title="Open Collection Page"
                            >
                                <Icon name="link" />
                            </a>
                        )}
                        <a
                            onClick={handleRenameClick}
                            className={clsx(styles.icon)}
                            role="button"
                            title="Rename Collection"
                        >
                            <Icon name="pencil" />
                        </a>
                        <a
                            onClick={handleDeleteClick}
                            className={clsx(styles.icon, styles.danger)}
                            role="button"
                            title="Delete Collection"
                        >
                            <Icon name="trash" />
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
