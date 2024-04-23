"use client"
import { ImageThumbnailView } from "@phylopic/ui"
import clsx from "clsx"
import { FC, useCallback, useContext } from "react"
import { BoardContext, BoardImageState } from "../play"
import styles from "./ImageSelector.module.scss"
export interface ImageSelectorProps {
    item: BoardImageState
}
const ImageSelector: FC<ImageSelectorProps> = ({ item }) => {
    const [, dispatch] = useContext(BoardContext) ?? []
    const handleClick = useCallback(() => {
        switch (item.mode) {
            case "selected": {
                dispatch?.({ type: "DESELECT", payload: item.image.uuid })
                break
            }
            case null: {
                dispatch?.({ type: "SELECT", payload: item.image.uuid })
                break
            }
        }
    }, [dispatch, item.mode, item.image.uuid])
    return (
        <button className={clsx(styles.main, styles[item.mode ?? "default"])} onClick={handleClick}>
            <ImageThumbnailView value={item.image} />
        </button>
    )
}
export default ImageSelector
