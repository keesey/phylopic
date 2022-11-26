import { ImageWithEmbedded } from "@phylopic/api-models"
import { AnchorLink, ImageThumbnailView } from "@phylopic/ui"
import { URL } from "@phylopic/utils"
import { FC } from "react"
import ImageCollectionUsage from "~/licenses/ImageCollectionUsage"
import CollectionLicense from "~/licenses/ImageCollectionUsage/CollectionLicense"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import LicenseView from "~/views/LicenseView"
import NomenView from "~/views/NomenView"
import styles from "./index.module.scss"
export interface Props {
    url: URL
    value: readonly ImageWithEmbedded[]
}
const ImagesView: FC<Props> = ({ url, value }) => {
    if (!value.length) {
        return null
    }
    return (
        <section id="images" className={styles.main}>
            <h2>Silhouette Images</h2>
            <CollectionLicense images={value} />
            <p>You may link to <a href={url} rel="canonical">this page</a> as a way of providing attribution and license information.</p>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Taxon</th>
                        <th>Attribution</th>
                        <th>License</th>
                    </tr>
                </thead>
                <tbody>
                    {value.map(image => (
                        <tr key={image.uuid}>
                            <td>
                                <AnchorLink href={`/images/${encodeURIComponent(image.uuid)}`}>
                                    <ImageThumbnailView value={image} />
                                </AnchorLink>
                            </td>
                            <td>
                                <AnchorLink href={image._links.specificNode.href}>
                                    <NomenView value={image._embedded.specificNode?.names[0]} short />
                                </AnchorLink>
                            </td>
                            <td>{image.attribution || "—"}</td>
                            <td>
                                <LicenseView value={image._links.license.href} short />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}
export default ImagesView
