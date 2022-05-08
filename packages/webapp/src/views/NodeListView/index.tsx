import { Node } from "@phylopic/api-models"
import clsx from "clsx"
import { FC } from "react"
import styles from "./index.module.scss"
import NodeListViewItems from "./NodeListViewItems"
export interface Props {
    short?: boolean
    value: readonly Node[]
    variant?: "lineage" | "list"
}
const NodeListView: FC<Props> = ({ variant = "list", ...itemsProps }) => {
    return (
        <ul className={clsx(styles.main, styles[variant])}>
            <NodeListViewItems {...itemsProps} />
        </ul>
    )
}
export default NodeListView
