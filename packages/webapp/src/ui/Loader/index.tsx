import { FC } from "react"
import { PropagateLoader } from "react-spinners"
import styles from "./index.module.scss"
const Loader: FC = () => (
    <div className={styles.main}>
        <PropagateLoader color="#0080a0" />
    </div>
)
export default Loader
