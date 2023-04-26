import { FC } from "react"
import QuickLinkNodeView from "./QuickLinkNodeView"
import QUICK_LINKS from "./QUICK_LINKS"
import styles from "./index.module.scss"
const QuickLinks: FC = () => (
    <div className={styles.main}>
        <QuickLinkNodeView node={QUICK_LINKS} />
    </div>
)
export default QuickLinks
