import { FC } from "react"
import styles from "./index.module.scss"
const MenuDivider: FC = () => {
    return (
        <li className={styles.main} role="separator">
            <hr />
        </li>
    )
}
export default MenuDivider
