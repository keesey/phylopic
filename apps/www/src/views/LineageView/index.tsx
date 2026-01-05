import { Node } from "@phylopic/api-models"
import { FC } from "react"
import styles from "./index.module.scss"
import LineageNodeView from "./LineageNodeView"
import { AgesProvider } from "./AgesProvider"
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
