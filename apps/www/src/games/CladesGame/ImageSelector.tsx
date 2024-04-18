import { CladesBoardContext, CladesBoardImageState } from "@phylopic/games"
import { ImageThumbnailView } from "@phylopic/ui"
import { FC, useCallback, useContext } from "react"
import styles from "./ImageSelector.module.scss"
import clsx from "clsx"
export interface ImageSelectorProps {
    item: CladesBoardImageState
}
const ImageSelector: FC<ImageSelectorProps> = ({ item }) => {
    const [, dispatch] = useContext(CladesBoardContext) ?? []
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
