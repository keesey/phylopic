import { FC } from "react"
import QuickLinkNodeView from "./QuickLinkNodeView"
import QUICK_LINKS from "./QUICK_LINKS"
import styles from "./index.module.scss"
import QuickLinkCladogramView from "./QuickLinkCladogramView"
const QuickLinks: FC = () => (
    <div className={styles.main}>
        <p>
            <QuickLinkNodeView node={QUICK_LINKS} />
        </p>
        <QuickLinkCladogramView node={QUICK_LINKS} />
    </div>
)
export default QuickLinks
