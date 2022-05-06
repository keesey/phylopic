import { ImageListParameters, ImageWithEmbedded, Node } from "@phylopic/api-models"
import { Query } from "@phylopic/utils/dist/http"
import { FC, useMemo } from "react"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import AnchorLink from "~/ui/AnchorLink"
import ImageListView from "~/views/ImageListView"
import NomenView from "~/views/NomenView"
import styles from "./index.module.scss"
export interface Props {
    pageSize?: number
    short?: boolean
    value: Node
}
const LineageNodeView: FC<Props> = ({ value }) => {
    const query = useMemo<ImageListParameters & Query>(
        () => ({ node: value.uuid, embed_items: "true", embed_specificNode: "true" }),
        [value.uuid],
    )
    return (
        <section className={styles.main}>
            <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/images`} query={query}>
                {items =>
                    items.length ? (
                        <div className={styles.images} key="images">
                            <ImageListView value={items as ImageWithEmbedded[]} />
                        </div>
                    ) : null
                }
            </PaginationContainer>
            <header className={styles.header} key="header">
                <AnchorLink href={`/nodes/${value.uuid}`}>
                    <NomenView value={value.names[0]} short />
                </AnchorLink>
            </header>
        </section>
    )
}
export default LineageNodeView
