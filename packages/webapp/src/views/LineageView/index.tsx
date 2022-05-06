import { Node } from "@phylopic/api-models"
import { FC } from "react"
import styles from "./index.module.scss"
import LineageNodeView from "./LineageNodeView"
export interface Props {
    short?: boolean
    value: readonly Node[]
}
const LineageView: FC<Props> = ({ short, value }) => {
    return (
        <ul className={styles.main}>
            {value.map(node => (
                <li key={node.uuid}>
                    <LineageNodeView value={node} short={short} />
                </li>
            ))}
        </ul>
    )
}
export default LineageView
