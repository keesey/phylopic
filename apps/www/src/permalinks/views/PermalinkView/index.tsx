import { URL } from "@phylopic/utils"
import { FC } from "react"
import { PermalinkData } from "../../types/PermalinkData"
import CollectionView from "./CollectionView"
export interface Props {
    url: URL
    value: PermalinkData
}
const PermalinkView: FC<Props> = ({ url, value }) => {
    switch (value.type) {
        case "collection": {
            return <CollectionView url={url} value={value} />
        }
        default: {
            return null
        }
    }
}
export default PermalinkView
