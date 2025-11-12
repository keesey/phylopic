import { Tag } from "@phylopic/utils"
import { FC } from "react"
import styles from "./index.module.scss"
export type Props = {
    tag: Tag
}
const TagView: FC<Props> = ({ tag }) => (
    <span className={styles.main} title={tag}>
        {tag}
    </span>
)
export default TagView
