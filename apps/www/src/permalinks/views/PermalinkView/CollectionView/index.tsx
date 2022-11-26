import { FC } from "react"
import { CollectionPermalinkData } from "~/permalinks/types/CollectionPermalinkData"
import ImagesView from "./ImagesView"
export interface Props {
    value: CollectionPermalinkData
}
const CollectionView: FC<Props> = ({ value }) => {
    // :TODO: Other entities
    return (
        <>
            <ImagesView value={value.entities.images} />
        </>
    )
}
export default CollectionView
