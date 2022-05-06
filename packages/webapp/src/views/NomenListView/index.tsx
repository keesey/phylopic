import { Nomen } from "@phylopic/utils/dist/models/types"
import { FC } from "react"
import NomenView from "../NomenView"
import styles from "./index.module.scss"
export interface Props {
    defaultText?: string
    short?: boolean
    value: readonly Nomen[]
}
const NomenListView: FC<Props> = ({ defaultText, short, value }) => {
    return (
        <ul className={styles.main}>
            {value.map((name, index) => (
                <li key={index} className={styles.item}>
                    <NomenView value={name} defaultText={defaultText} short={short} />
                </li>
            ))}
        </ul>
    )
}
export default NomenListView
