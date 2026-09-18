import type { Node } from "@phylopic/api-models"
import type { FC } from "react"
import { AgesProvider } from "./AgesProvider"
import styles from "./index.module.scss"
import LineageNodeView from "./LineageNodeView"

export interface Props {
    short?: boolean
    value: readonly Node[]
}

const LineageView: FC<Props> = ({ short, value }) => {
    return (
        <AgesProvider nodes={value}>
            <ul className={styles.main}>
                {value.map(node => (
                    <li key={node.uuid}>
                        <LineageNodeView value={node} short={short} />
                    </li>
                ))}
            </ul>
        </AgesProvider>
    )
}

export default LineageView
