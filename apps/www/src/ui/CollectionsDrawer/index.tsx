"use client"
import { DATA_MEDIA_TYPE } from "@phylopic/api-models"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { DragEvent, FC, Suspense, useContext, useState } from "react"
import customEvents from "~/analytics/customEvents"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollectionImages from "~/collections/hooks/useCurrentCollectionImages"
import useOpen from "~/collections/hooks/useOpen"
import getImageFromDataTransfer from "./getImageFromDataTransfer"
import styles from "./index.module.scss"
const Open = dynamic(() => import("./Open"), { ssr: false })
const Closed = dynamic(() => import("./Closed"), { ssr: false })
const CollectionsDrawer: FC = () => {
    const [dragging, setDragging] = useState(false)
    const [{ currentCollection }, dispatch] = useContext(CollectionsContext)
    const open = useOpen()
    const images = useCurrentCollectionImages()
    const handleDragOverOrEnter = (event: DragEvent) => {
        if (event.dataTransfer.types.includes(DATA_MEDIA_TYPE)) {
            event.preventDefault()
            event.dataTransfer.dropEffect = "copy"
            setDragging(true)
        }
    }
    const handleDragLeave = (_event: DragEvent) => {
        setDragging(false)
    }
    const handleDrop = (event: DragEvent) => {
        const image = getImageFromDataTransfer(event.dataTransfer)
        if (image && !images.some(i => i.uuid === image.uuid)) {
            event.preventDefault()
            customEvents.dropImage(currentCollection, image)
            dispatch({ type: "ADD_TO_CURRENT_COLLECTION", payload: { type: "image", entity: image } })
        }
        setDragging(false)
    }
    return (
        <aside
            className={clsx(styles.main, dragging && styles.dragging)}
            onDragEnter={handleDragOverOrEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOverOrEnter}
            onDrop={handleDrop}
        >
            <a
                className={styles.toggle}
                onClick={() => {
                    customEvents.toggleCollectionDrawer(!open)
                    dispatch({ type: "TOGGLE" })
                }}
                role="button"
            >
                {open ? "▼" : "▲"}
            </a>
            <Suspense>{open ? <Open /> : <Closed />}</Suspense>
        </aside>
    )
}
export default CollectionsDrawer
