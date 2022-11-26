import { FC } from "react"
import { PermalinkData } from "../../types/PermalinkData"
import CollectionView from "./CollectionView"
export interface Props {
    value: PermalinkData
}
const PermalinkView: FC<Props> = ({ value }) => {
    switch (value.type) {
        case "collection": {
            return <CollectionView value={value} />
        }
        default: {
            return null
        }
    }
}
export default PermalinkView
