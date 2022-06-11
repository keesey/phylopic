import { NodeWithEmbedded } from "@phylopic/api-models"
import { ImageThumbnailView } from "@phylopic/ui"
import { extractPath } from "@phylopic/utils"
import { ReactNode, FC, useMemo } from "react"
import AnchorLink from "~/ui/AnchorLink"
import NomenView from "../NomenView"
import EmptyImage from "./EmptyImage"
import styles from "./index.module.scss"
export interface Props {
    caption?: ReactNode
    short?: boolean
    value: NodeWithEmbedded
}
const IllustratedNodeView: FC<Props> = ({ caption, value, short }) => {
    const href = useMemo(() => extractPath(value._links.self.href), [value._links.self.href])
    return (
        <AnchorLink href={href}>
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
