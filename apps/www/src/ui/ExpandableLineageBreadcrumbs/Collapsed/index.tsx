import { useMemo, FC } from "react"
import Breadcrumbs, { BreadcrumbItem } from "../../Breadcrumbs"
import styles from "./index.module.scss"
export interface Props {
    afterItems: readonly BreadcrumbItem[]
    beforeItems: readonly BreadcrumbItem[]
    onClick: () => void
}
const Collapsed: FC<Props> = ({ afterItems, beforeItems, onClick }) => {
    const items = useMemo<readonly BreadcrumbItem[]>(
        () => [
            ...beforeItems,
            {
                children: (
                    <button className={styles.button} onClick={onClick}>
                        …
                    </button>
                ),
            },
            ...afterItems,
        ],
        [afterItems, beforeItems, onClick],
    )
    return <Breadcrumbs items={items} />
}
export default Collapsed
