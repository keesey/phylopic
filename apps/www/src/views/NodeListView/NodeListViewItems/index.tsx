import { Node } from "@phylopic/api-models"
import Link from "next/link"
import { FC } from "react"
import getCladeImagesUUID from "~/models/getCladeImagesUUID"
import getNodeHRef from "~/routes/getNodeHRef"
import NomenView from "~/views/NomenView"
import styles from "./index.module.scss"
export interface Props {
    short?: boolean
    value: readonly Node[]
}
const NodeListViewItems: FC<Props> = ({ short, value }) => {
    return (
        <>
            {value.map(node => (
                <li key={node.uuid} className={styles.item}>
                    <Link
                        href={getNodeHRef({
                            href: `/nodes/${getCladeImagesUUID(node)}`,
                            title: node._links.cladeImages?.title ?? "[Unnamed]",
                        })}
                    >
                        <NomenView value={node.names[0]} short={short} />
                    </Link>
                </li>
            ))}
        </>
    )
}
export default NodeListViewItems
