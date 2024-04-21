import { NomenView as UINomenView, NomenViewProps } from "@phylopic/ui"
import { FC } from "react"
import styles from "./index.module.scss"
export type Props = Omit<NomenViewProps, "classes">
const NomenView: FC<Props> = props => {
    return <UINomenView {...props} classes={styles} />
}
export default NomenView
