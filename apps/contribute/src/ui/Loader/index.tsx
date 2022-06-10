import { FC } from "react"
import { PropagateLoader } from "react-spinners"
import styles from "./index.module.scss"
export interface Props {
    color?: string
}
const Loader: FC<Props> = ({ color = "#fade85" }) => (
    <div className={styles.main}>
        <PropagateLoader color={color} />
    </div>
)
export default Loader
