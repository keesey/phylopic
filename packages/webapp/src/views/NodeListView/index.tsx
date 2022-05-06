import clsx from "clsx"
import { Node } from "@phylopic/api-models"
import { FC } from "react"
import AnchorLink from "~/ui/AnchorLink"
import NomenView from "../NomenView"
import styles from "./index.module.scss"
export interface Props {
    short?: boolean
    value: readonly Node[]
    variant?: "lineage" | "list"
}
const NodeListView: FC<Props> = ({ short, value, variant = "list" }) => {
    return (
        <ul className={clsx(styles.main, styles[variant])}>
            {value.map(node => (
                <li key={node.uuid} className={styles.item}>
                    <AnchorLink href={`/nodes/${node.uuid}`}>
                        <NomenView value={node.names[0]} short={short} />
                    </AnchorLink>
                </li>
            ))}
        </ul>
    )
}
export default NodeListView
