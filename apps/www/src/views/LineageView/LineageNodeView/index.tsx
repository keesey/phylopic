import { ImageListParameters, ImageWithEmbedded, Node } from "@phylopic/api-models"
import { AnchorLink, PaginationContainer } from "@phylopic/ui"
import { Query } from "@phylopic/utils"
import { FC, useMemo } from "react"
import nodeHasOwnCladeImages from "~/models/nodeHasOwnCladeImages"
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
        () => ({ filter_node: value.uuid, embed_items: "true", embed_specificNode: "true" }),
        [value.uuid],
    )
    const linked = useMemo(() => nodeHasOwnCladeImages(value), [value])
    return (
        <section className={styles.main}>
            <PaginationContainer endpoint={`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/images`} query={query}>
                {items =>
                    items.length ? (
                        <div className={styles.images} key="images">
                            <ImageListView value={items as ImageWithEmbedded[]} />
                        </div>
                    ) : null
                }
            </PaginationContainer>
            <header className={styles.header} key="header">
                {linked ? (
                    <AnchorLink href={`/nodes/${value.uuid}`}>
                        <NomenView value={value.names[0]} short key="name" />
                    </AnchorLink>
                ) : (
                    <NomenView value={value.names[0]} short key="name" />
                )}
            </header>
        </section>
    )
}
export default LineageNodeView
