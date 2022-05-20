import { useMemo, FC } from "react"
import Breadcrumbs, { BreadcrumbItem } from "../../Breadcrumbs"
export interface Props {
    afterItems: readonly BreadcrumbItem[]
    beforeItems: readonly BreadcrumbItem[]
}
const Static: FC<Props> = ({ afterItems, beforeItems }) => {
    const items = useMemo<readonly BreadcrumbItem[]>(() => [...beforeItems, ...afterItems], [afterItems, beforeItems])
    return <Breadcrumbs items={items} />
}
export default Static
