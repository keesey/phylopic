import { NodeWithEmbedded } from "@phylopic/api-models"
import { ImageThumbnailView } from "@phylopic/ui"
import { extractPath } from "@phylopic/utils"
import Link from "next/link"
import { FC, ReactNode, useMemo } from "react"
import customEvents from "~/analytics/customEvents"
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
        <Link
            href={href}
            onClick={() =>
                customEvents.clickNodeLink(
                    "search_result",
                    value,
                    typeof caption === "string" ? caption : undefined,
                    "button",
                )
            }
        >
            <figure className={styles.figure}>
                {value?._embedded?.primaryImage && <ImageThumbnailView value={value._embedded.primaryImage} />}
                {!value?._embedded?.primaryImage && <EmptyImage />}
                <figcaption>{caption || <NomenView value={value.names[0]} short={short} />}</figcaption>
            </figure>
        </Link>
    )
}
export default IllustratedNodeView
