import { URL } from "@phylopic/utils"
import { FC } from "react"
import { CollectionPermalinkData } from "~/permalinks/types/CollectionPermalinkData"
import ImagesView from "./ImagesView"
export interface Props {
    url: URL
    value: CollectionPermalinkData
}
const CollectionView: FC<Props> = ({ url, value }) => {
    // :TODO: Other entities
    return <ImagesView url={url} value={value.entities.images} />
}
export default CollectionView
