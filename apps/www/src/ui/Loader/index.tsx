import dynamic from "next/dynamic"
import { FC } from "react"
import styles from "./index.module.scss"
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"), { ssr: false })
const Loader: FC = () => (
    <div className={styles.main}>
        <PropagateLoader
            color="#0080a0"
            css={PropagateLoader.defaultProps!.css!}
            loading={PropagateLoader.defaultProps!.loading!}
            size={PropagateLoader.defaultProps!.size!}
            speedMultiplier={PropagateLoader.defaultProps!.speedMultiplier!}
        />
    </div>
)
export default Loader
