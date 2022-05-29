import { Node } from "@phylopic/api-models"
import { FC, useMemo } from "react"
import nodeHasOwnCladeImages from "~/models/nodeHasOwnCladeImages"
import NomenView from "~/views/NomenView"
import Breadcrumbs, { BreadcrumbItem } from "../../Breadcrumbs"
export interface Props {
    afterItems: readonly BreadcrumbItem[]
    beforeItems: readonly BreadcrumbItem[]
    values: readonly Node[]
}
const Expanded: FC<Props> = ({ afterItems, beforeItems, values }) => {
    const valueItems = useMemo<readonly BreadcrumbItem[]>(
        () =>
            values.length > 0
                ? [...values].reverse().map(node => ({
                      children: <NomenView value={node.names[0]} short />,
                      href: nodeHasOwnCladeImages(node) ? `/nodes/${node.uuid}` : undefined,
                  }))
                : [
                      {
                          children: "...",
                      },
                  ],
        [values],
    )
    const items = useMemo(() => [...beforeItems, ...valueItems, ...afterItems], [afterItems, beforeItems, valueItems])
    return <Breadcrumbs items={items} />
}
export default Expanded
