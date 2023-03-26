import { Nomen, stringifyNomen } from "@phylopic/utils"
import { FC, ReactNode } from "react"
import NomenView from "~/views/NomenView"
import styles from "./index.module.scss"
export interface Props {
    header?: ReactNode
    names: readonly Nomen[]
}
const NameList: FC<Props> = ({ header, names }) => {
    return (
        <aside className={styles.main}>
            {header && <h2>{header}</h2>}
            <ul>
                {names.map(name => (
                    <li key={stringifyNomen(name)}>
                        <NomenView value={name} />
                    </li>
                ))}
            </ul>
        </aside>
    )
}
export default NameList
