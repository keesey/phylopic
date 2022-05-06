import { Node } from "@phylopic/api-models"
import { useMemo, FC } from "react"
import NameView from "~/views/NameView"
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
                ? [...values].reverse().map(({ names, uuid }) => ({
                      children: <NameView value={names[0]} short />,
                      href: `/nodes/${uuid}`,
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
