import { useMemo, type FC } from "react"
import { type Cladogram } from "~/cladograms/models"

const BasicSVGCladogramRenderer: FC<Cladogram> = ({ graph, metadata }) => {
    const nodes = useMemo(() => {
        const plottedNodes = graph.nodes.map(
            n => ({
                data: n,
                height: 0,
                width: 0,
                x: 0,
                y: 0,
            }),
            [],
        )
        return plottedNodes
    }, [graph.nodes])
    const height = useMemo(() => nodes.reduce((prev, n) => Math.max(prev, n.y + n.height), 0), [nodes])
    const width = useMemo(() => nodes.reduce((prev, n) => Math.max(prev, n.x + n.width), 0), [nodes])
    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width={`${width}px`}
            height={`${height}px`}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
        >
            {/* :TODO: metadata */}
            {/* :TODO: graph */}
        </svg>
    )
}
export default BasicSVGCladogramRenderer
