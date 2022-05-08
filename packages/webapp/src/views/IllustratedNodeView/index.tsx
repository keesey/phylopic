import { NodeWithEmbedded } from "@phylopic/api-models"
import { ReactNode, FC } from "react"
import AnchorLink from "~/ui/AnchorLink"
import ImageThumbnailView from "../ImageThumbnailView"
import NomenView from "../NomenView"
import EmptyImage from "./EmptyImage"
import styles from "./index.module.scss"
export interface Props {
    caption?: ReactNode
    short?: boolean
    value: NodeWithEmbedded
}
const IllustratedNodeView: FC<Props> = ({ caption, value, short }) => {
    return (
        <AnchorLink href={value._links.self.href}>
            <figure className={styles.figure}>
                {value?._embedded?.primaryImage && (
                    <ImageThumbnailView
                        value={{ ...value._embedded.primaryImage, _embedded: { specificNode: value } }}
                    />
                )}
                {!value?._embedded?.primaryImage && <EmptyImage />}
                <figcaption>{caption || <NomenView value={value.names[0]} short={short} />}</figcaption>
            </figure>
        </AnchorLink>
    )
}
export default IllustratedNodeView
