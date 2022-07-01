import dynamic from "next/dynamic"
import { FC } from "react"
import styles from "./index.module.scss"
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"), { ssr: false })
const Loader: FC = () => (
    <div className={styles.main}>
        <PropagateLoader color="#0080a0" css="" loading size={15} speedMultiplier={1} />
    </div>
)
export default Loader
