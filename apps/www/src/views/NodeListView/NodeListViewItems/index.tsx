import { Node } from "@phylopic/api-models"
import { FC } from "react"
import getCladeImagesUUID from "~/models/getCladeImagesUUID"
import AnchorLink from "~/ui/AnchorLink"
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
                    <AnchorLink href={`/nodes/${getCladeImagesUUID(node)}`}>
                        <NomenView value={node.names[0]} short={short} />
                    </AnchorLink>
                </li>
            ))}
        </>
    )
}
export default NodeListViewItems
