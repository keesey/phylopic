import { NodeName } from "@phylopic/api-models"
import { FC } from "react"
import NameView from "../NameView"
import styles from "./index.module.scss"
export interface Props {
    defaultText?: string
    short?: boolean
    value: readonly NodeName[]
}
const NameListView: FC<Props> = ({ defaultText, short, value }) => {
    return (
        <ul className={styles.main}>
            {value.map((name, index) => (
                <li key={index} className={styles.item}>
                    <NameView value={name} defaultText={defaultText} short={short} />
                </li>
            ))}
        </ul>
    )
}
export default NameListView
