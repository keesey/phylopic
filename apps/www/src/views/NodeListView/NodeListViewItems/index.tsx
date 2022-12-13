import { Node } from "@phylopic/api-models"
import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import getCladeImagesUUID from "~/models/getCladeImagesUUID"
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
                    <Link href={`/nodes/${getCladeImagesUUID(node)}`}>
                        <NomenView value={node.names[0]} short={short} />
                    </Link>
                </li>
            ))}
        </>
    )
}
export default NodeListViewItems
