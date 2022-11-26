import { ImageWithEmbedded } from "@phylopic/api-models"
import { UUIDish } from "@phylopic/utils"
import { FC } from "react"
import CollectionAttribution from "./CollectionAttribution"
import CollectionLicense from "./CollectionLicense"
export interface Props {
    items?: readonly ImageWithEmbedded[]
    total?: number
    uuid?: UUIDish
}
const ImageCollectionUsage: FC<Props> = ({ items, total, uuid }) => {
    const images = items?.length === total ? items ?? [] : []
    if (!total) {
        // :TODO: Skeleton?
        return null
    }
    return (
        <section>
            <CollectionLicense images={images} />
            <CollectionAttribution images={images} uuid={uuid} />
        </section>
    )
}
export default ImageCollectionUsage
