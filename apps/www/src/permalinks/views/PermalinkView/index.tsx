import type { URL } from "@phylopic/utils"
import type { FC } from "react"
import type { PermalinkData } from "../../types/PermalinkData"
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
