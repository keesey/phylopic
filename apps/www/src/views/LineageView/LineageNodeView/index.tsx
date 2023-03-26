import { ImageListParameters, ImageWithEmbedded, Node } from "@phylopic/api-models"
import { Loader, PaginationContainer } from "@phylopic/ui"
import { Query } from "@phylopic/utils"
import clsx from "clsx"
import Link from "next/link"
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
            <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/images`} query={query}>
                {(items, _total, isLoading) =>
                    items.length ? (
                        <div className={styles.images}>
                            <ImageListView value={items as ImageWithEmbedded[]} />
                        </div>
                    ) : isLoading ? (
                        <div className={clsx(styles.images, styles.loader)}>
                            <Loader />
                        </div>
                    ) : null
                }
            </PaginationContainer>
            <header className={styles.header}>
                {linked ? (
                    <Link href={`/nodes/${value.uuid}`}>
                        <NomenView value={value.names[0]} short />
                    </Link>
                ) : (
                    <NomenView value={value.names[0]} short />
                )}
            </header>
        </section>
    )
}
export default LineageNodeView
