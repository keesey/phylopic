import type { Node } from "@phylopic/api-models"
import type { FC } from "react"
import styles from "./index.module.scss"
import NodeListViewItems from "./NodeListViewItems"

export interface Props {
    short?: boolean
    value: readonly Node[]
    variant?: "inline" | "lineage" | "list"
}

const NodeListView: FC<Props> = ({ variant = "inline", ...itemsProps }) => {
    return (
        <ul className={styles[variant]}>
            <NodeListViewItems {...itemsProps} />
        </ul>
    )
}

export default NodeListView
