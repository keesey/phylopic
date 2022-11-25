import { ImageWithEmbedded } from "@phylopic/api-models"
import { UUIDish } from "@phylopic/utils"
import { FC } from "react"
import CollectionAttribution from "./CollectionAttribution"
import CollectionLicense from "./CollectionLicense"
import useCollectionLicense from "./CollectionLicense/useCollectionLicense"
export interface Props {
    items?: readonly ImageWithEmbedded[]
    total?: number
    uuid: UUIDish
}
const ImageCollectionUsage: FC<Props> = ({ items, total, uuid }) => {
    const images = items?.length === total ? items ?? [] : []
    const license = useCollectionLicense(images)
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
