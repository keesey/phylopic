import { useMemo, type FC } from "react"
import { CladogramArc, CladogramNode } from "~/cladograms/models"
import Area from "./Area"
const DEFAULT_AREA = new Area(0, 0, 0, 0)
export type Props = {
    arc: CladogramArc
    areas: Readonly<[Area, Area]>
    imageSize: number
    nodes: Readonly<[CladogramNode, CladogramNode]>
}
const ArcRenderer: FC<Props> = ({ arc, areas, imageSize, nodes }) => {
    const d = useMemo(() => {
        const p1 = { x: areas[0].right, y: areas[0].top + (nodes[0].imageUUID ? imageSize : 0) }
        const p2 = { x: areas[1].left, y: areas[1].top + (nodes[1].imageUUID ? imageSize : 0) }
        const p3x = areas[1].right
        return `M${p1.x},${p1.y}S${p1.x},${p2.y},${p2.x},${p2.y}H${p3x}`
    }, [areas, imageSize, nodes])
    // :TODO: metadata
    console.debug(d)
    return <path className="arc" d={d} />
}
export default ArcRenderer
