import type { FC } from "react"
import QUICK_LINKS from "./QUICK_LINKS"
import QuickLinkNodeView from "./QuickLinkNodeView"
import styles from "./index.module.scss"
const QuickLinks: FC = () => (
    <div className={styles.main}>
        <QuickLinkNodeView node={QUICK_LINKS} />
    </div>
)
export default QuickLinks
