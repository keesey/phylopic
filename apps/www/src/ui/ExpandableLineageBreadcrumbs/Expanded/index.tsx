import { Node } from "@phylopic/api-models"
import { FC, useMemo } from "react"
import nodeHasOwnCladeImages from "~/models/nodeHasOwnCladeImages"
import getNodeHRef from "~/routes/getNodeHRef"
import NomenView from "~/views/NomenView"
import Breadcrumbs, { BreadcrumbItem } from "../../Breadcrumbs"
export interface Props {
    afterItems: readonly BreadcrumbItem[]
    beforeItems: readonly BreadcrumbItem[]
    values: readonly Node[]
}
const Expanded: FC<Props> = ({ afterItems, beforeItems, values }) => {
    const valueItems = useMemo<readonly BreadcrumbItem[]>(
        () => [
            {
                children: <NomenView value={[{ class: "scientific", text: "Pan-Biota" }]} />,
                href: `/nodes/${process.env.NEXT_PUBLIC_ROOT_UUID}/pan-biota-silhouettes`,
                // :TODO: tracking
            },
            ...(values.length > 0
                ? [...values.filter(node => node.uuid !== process.env.NEXT_PUBLIC_ROOT_UUID)].reverse().map(node => ({
                      children: <NomenView value={node.names[0]} short />,
                      href: nodeHasOwnCladeImages(node) ? getNodeHRef(node._links.self) : undefined,
                  }))
                : [
                      {
                          children: "...",
                      },
                  ]),
        ],
        [values],
    )
    const items = useMemo(() => [...beforeItems, ...valueItems, ...afterItems], [afterItems, beforeItems, valueItems])
    return <Breadcrumbs items={items} />
}
export default Expanded
