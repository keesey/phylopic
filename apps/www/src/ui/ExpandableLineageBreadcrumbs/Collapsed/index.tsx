import { FC, useMemo } from "react"
import NomenView from "~/views/NomenView"
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
                children: <NomenView value={[{ class: "scientific", text: "Pan-Biota" }]} />,
                href: `/nodes/${process.env.NEXT_PUBLIC_ROOT_UUID}/pan-biota-silhouettes`,
                // :TODO: tracking
            },
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
